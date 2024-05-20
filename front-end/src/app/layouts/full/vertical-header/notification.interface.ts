export interface Notification {
  id: number; // Adjust the data type of id as needed
  useravatar: string;
  status: string;
  from: string;
  subject: string;
  time: string;
  treated: boolean;
}
