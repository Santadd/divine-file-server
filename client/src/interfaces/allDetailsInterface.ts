import { BusinessFile } from "./businessFileInterface";

export interface AllDetailsInterface {
    success: boolean;
    message: string;
    data: {
      id: number;
      title: string;
      description: string;
      file: string;
      dateAdded: string;
      downloads: {
        id: number;
        downloadDate: string;
        email: {
          id: string;
          recipientEmail: string;
          sendDate: string;
        };
      }[];
    }[];
    paginationInfo: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      pages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    }
}  