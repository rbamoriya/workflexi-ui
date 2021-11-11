export class BaseService {

    // converts null to empty string ( null => '')
    public sanitizeParameter(companyId): string {
      return companyId ? companyId : '';
    }
}