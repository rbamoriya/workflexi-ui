import { AbstractControl, ValidatorFn } from '@angular/forms';
import { environment } from '../../environments/environment.prod';

//To run jquery
declare var $:any;

/**
 * All route url paths
 */
export class ROUTS {

  public static INDEX_PATH: string = '';
  public static HOME: string = '';
  public static AUTH_INBOARDING: string = '/auth/inboarding';
  public static AUTH_LOGIN: string = '/auth/login';
  public static ADD_SKILL: string = '/gigworker/skills';
  public static UPDATE_SKILL: string = '/gigworker/edit/skills';
  public static ADD_NEW_SKILL: string = '/gigworker/add/skills/new';
  public static ADD_GIGWORKER_BASIC_INFO: string = '/userprofile/basicinfo';
  public static GIGWORKER_PROFILE: string = '/userprofile/profile';
  public static ADD_HIRER_BASIC_INFO: string = '/hiring/basicinfo';
  public static ADD_PAYMENT_INFO: string = '/userprofile/payments';
  public static GIG_WORKER_DASHBOARD: string = '/gigworker/dashboard';
  public static HIRER_SKILL_LOOKING: string = '/hiring/skillslooking';
  public static HIRER_EDIT_SKILL_LOOKING: string = '/hiring/edit/skillslooking';
  public static HIRER_DASHBOARD: string = '/hiring/dashboard';
  public static HIRER_PROFILE: string = '/hiring/profile';
  public static HIRER_NEW_SKILLOOKIG: string = '/hiring/add/skillslooking/new';
  public static USER_PROFILE_EDIT: string = '/userprofile/basicinfo/edit';
  public static USER_PAYMENTS_EDIT: string = '/userprofile/payments/edit';
  public static HIRER_CANDIDATE: string = '/hiring/candidate';
  public static GIGWORKER_CANDIDATE: string = '/gigworker/candidate';
  public static CREATE_MILESTONE: string = '/milestone/create-milestone/';
  public static APPROVAL_MILESTONE: string = '/milestone/approval-milestone/';
  public static APPROVED_MILESTONE: string = '/milestone/approved-milestone/';
  public static SET_UP_COMPANY: string = '/company/setup';
  public static SET_COMPANY_BASICINFO: string = '/company/basicinfo';
  public static SET_COMPANY_BANK_DETAILS: string = '/company/bank-details';
  public static SET_COMPANY_EDIT: string = '/company/edit';
  public static COMPANY_PROFILE: string = '/company/profile';
}

/**
 * Urls for fetching data from backend
 */
export class URL {

  public static readonly FINAL_PATH: string = environment.apiEndpoint + '/';
  public static readonly LOGIN: string = URL.FINAL_PATH + 'auth/login';
;
}

/**
 * All constants
 */
export class CONSTANTS {

  public static readonly ACCESS_TOKEN_COOKIE = 't';
  public static readonly MAX_FILE_UPLOAD_SIZE_LIMIT = 524288; //limit 500kb
  public static readonly MAX_VIDEO_FILE_UPLOAD_SIZE_LIMIT = 52428800; //limit 50mb
}

export class MESSAGES {

  public static SERVER_ERROR_MSG = 'We are facing some critical problem. please check the site after sometime.';
  public static USERNAME_PASSWORD_INVALID = 'Your email or password is invalid. Please try again.';
  public static IMAGE_SIZE_TO_LARGE = 'Image size too large!! Please upload image less than 4MB size.';
  public static FILE_IS_NOT_PROPER = 'Please upload your profile picture.';
  public static CSV_FILE_IS_NOT_PROPER = 'Please upload file with extension .csv';
  public static FILE_SIZE_TO_LARGE = 'File size too large!! Please upload file less than 4MB size.';
}

export class PageTitle {

}

/**
 * Only number keyup
 */
export function onlyNumberKey(event : any) : any {

  if(event.which != 8 && event.which != 0 && (event.which < 48 || event.which > 57))
    return false;
  return true;
}

/**
 * Get random number
 */
export function getRandomNumber() {
  return Math.floor(Math.random() * (999999 - 100000)) + 100000;
}

/**
 * Get random string
 */
export function getRandomString() {
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
  const lengthOfCode = 10;
  let text = "";
  for (let i = 0; i < lengthOfCode; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Scroll to top
 */
export function scrollToTop() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
}

export function scrollToDiv(div:string) {
  $("html, body").animate({ scrollTop: $(div).offset().top }, "slow");
}

export function firefoxValidator(nameRe: string): ValidatorFn {
  
  return (control: AbstractControl): {[key: string]: any} | null => {
    if(control.value === nameRe) {
      return {
        colour1: {valid: false}
     };
    }
    return null;
  };
}

export function calculateDiff(dateSent){
  let currentDate = new Date();
  dateSent = new Date(dateSent);

  return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
}

export const INDIAN_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};