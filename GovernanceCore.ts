export interface Proposal {
  id: string;
  title: string;
  creator: string;
  choices: string[];
  votes: Map<string, string>;
  endTime: number;
  executed: boolean;
}

export class GovernanceCore {
  private proposals: Map<string, Proposal>;

  constructor() {
    this.proposals = new Map();
  }

  public createProposal(title: string, creator: string, choices: string[], duration: number = 86400000): Proposal {
    const id = this.generateId();
    const p: Proposal = {
      id, title, creator, choices, votes: new Map(), endTime: Date.now() + duration, executed: false
    };
    this.proposals.set(id, p);
    return p;
  }

  public vote(proposalId: string, voter: string, choice: string): boolean {
    const p = this.proposals.get(proposalId);
    if (!p || p.votes.has(voter) || Date.now() > p.endTime) return false;
    if (!p.choices.includes(choice)) return false;
    p.votes.set(voter, choice);
    return true;
  }

  public getResult(proposalId: string): any {
    const p = this.proposals.get(proposalId);
    if (!p) return null;
    const count: any = {};
    p.choices.forEach(c => count[c] = 0);
    p.votes.forEach(c => count[c]++);
    return count;
  }

  public executeProposal(proposalId: string): boolean {
    const p = this.proposals.get(proposalId);
    if (!p || p.executed || Date.now() < p.endTime) return false;
    p.executed = true;
    return true;
  }

  private generateId(): string {
    return Math.random().toString(16).slice(2, 14);
  }
}
