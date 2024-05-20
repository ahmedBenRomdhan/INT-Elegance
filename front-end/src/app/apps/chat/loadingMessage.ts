export interface LoadingMessage {
  id: string;
  message_body: string;
  senderId: any;
  createdAt: Date;
  fileMetadata?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    fileUrl: string
  };
}
