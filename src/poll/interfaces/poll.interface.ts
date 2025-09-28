export interface PollInterface {
  id: number;
  question: string;
  options: {
    id: number;
    option: string;
    voteCount: number;
  };
}