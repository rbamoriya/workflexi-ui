export class ImageFiles {

    id: string;

    file: any;

    fileTypeEnum: string;

    fileUrl: string;
}

export enum FileTypeEnum {
    IMAGE,
    EXCEL,
    DOC,
    PDF,
    OTHER
}