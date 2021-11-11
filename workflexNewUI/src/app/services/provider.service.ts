import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import * as FileSaver from "file-saver";
import { environment } from './../../environments/environment';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService extends BaseService {

  _token = null;
  userId = null;
  apiEndpoint = environment.apiEndpoint;
  httpHeaderOptions = null;
  httpHeaderUploadOptions = null;

  constructor(private http: HttpClient) {
    super();
    this._token = localStorage.getItem('_token');
    this.userId = localStorage.getItem('userId');
    this.httpHeaderOptions = {
  	  headers: new HttpHeaders({
  	    'Content-Type':  'application/json',
  	    'Authorization': this._token
  	  }),
      observe: 'response' as 'response'
    };
    this.httpHeaderUploadOptions = {
  	  headers: new HttpHeaders({
  	    //'Content-Type':  'multipart/form-data',
  	    'Authorization': this._token
  	  }),
      observe: 'response' as 'response'
    };
  }

  industryList(){
    return this.http.get(this.apiEndpoint+"/master/industry/list", this.httpHeaderOptions);
  }

  specializationList(){
    return this.http.get(this.apiEndpoint+"/master/specialization/list", this.httpHeaderOptions);
  }

  skillList(){
    this.init();
    return this.http.get(this.apiEndpoint+"/master/skill/list", this.httpHeaderOptions);
  }

  eventTypeList(){
    return this.http.get(this.apiEndpoint+"/master/eventTypes/list", this.httpHeaderOptions);
  }

  passionList(){
    return this.http.get(this.apiEndpoint+"/master/passion/list", this.httpHeaderOptions);
  }

  getFormFields(templateType){
    return this.http.get(this.apiEndpoint+"/template/details?templateType="+templateType, this.httpHeaderOptions);
  }

  createProvider(data){
    return this.http.post(this.apiEndpoint+`/provider/create`, data, this.httpHeaderOptions);
  }

  listProvider(companyId, type){
    this.init();
    return this.http.get(this.apiEndpoint+`/provider/list?type=`+type+`&companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  // applyForGig(id){
  //   //console.log('Gig Service Call', this.apiEndpoint+`/provider/apply/`+id, this.httpHeaderOptions);
  //   return this.http.get(this.apiEndpoint+`/provider/apply/`+id, this.httpHeaderOptions);
  // }

  providerDetails(id, companyId){
    return this.http.get(this.apiEndpoint+`/provider/details/`+id+`?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  updateProvider(serializedForm, id){
    return this.http.put(this.apiEndpoint+`/provider/update/`+id, serializedForm, this.httpHeaderOptions);
  }

  listSeeker(keyword,name,location,minExp,maxExp){
    return this.http.get(this.apiEndpoint+`/seeker/search?keyword=`+keyword
      + `&name=`+name + `&location=` +location +`&minExperience=`+minExp +`&maxExperience=`+maxExp
    , this.httpHeaderOptions);
  }

  seekerDetails(id, companyId){
    return this.http.get(this.apiEndpoint+`/seeker/details/`+id+`?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  shortlistSeeker(seekerId, companyId){
    return this.http.get(this.apiEndpoint+`/seeker/shortlist/`+seekerId+`?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  isSeekerShortlisted(seekerId, companyId){
    return this.http.get(this.apiEndpoint+`/seeker/isShortlisted/`+seekerId+`?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  listSeekerProfiles(companyId, type){
    this.init();
    return this.http.get(this.apiEndpoint+`/seeker/list?type=`+type+`&companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  getShortlistedSeekersList(companyId, type){
    return this.http.get(this.apiEndpoint+`/seeker/shortlistedSeekers?type=`+type+`&companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  searchByFilter_ShortlistedHirer(companyId,searchText, name,
    location, minExp, maxExp){
    return this.http.get(this.apiEndpoint+`/seeker/shortlistedSeekers?companyId=`+this.sanitizeParameter(companyId) +
           `&keyword=` + searchText + 
              `&name=`+name + `&location=`+location+
              `&minExperience=`+minExp + `&maxExperience=`+maxExp, this.httpHeaderOptions);
  }

  getAppliedGigsList(companyId){
    this.init();
    return this.http.get(this.apiEndpoint+`/provider/appliedGigs?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  searchByFilter_ShortlistGigsList(companyId,view,searchText,name,location,minExp,maxExp){
    this.init();
    return this.http.get(this.apiEndpoint+`/provider/search/shortlistGigs?companyId=`+this.sanitizeParameter(companyId) + 
    `&keyword=` + searchText + 
              `&name=`+name + `&location=`+location+
              `&minExperience=`+minExp + `&maxExperience=`+maxExp + `&view=`+view, this.httpHeaderOptions);
  }

  isProviderApplied(providerId, companyId){
    return this.http.get(this.apiEndpoint+`/provider/isApplied/`+providerId+`?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  applyForGig(providerId, companyId){
    return this.http.get(this.apiEndpoint+`/provider/apply/`+providerId+`?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  downloadResource(folder, file, type){
    return this.http.get(this.apiEndpoint+`/download/`+folder+`/`+file+`?type=`+type, { headers: new HttpHeaders({
      'Authorization': this._token,
      'Content-Type': 'application/octet-stream',
      }), responseType: 'blob'}).pipe (
      tap (
        data => {
          FileSaver.saveAs(data, file);
        },
        error => console.log(error)
      )
     );

  }

  orderCreatePayment(data){
    return this.http.post(this.apiEndpoint+`/payment/createUserPayment`, data, this.httpHeaderOptions);
  }

  updatePayment(data, userSubscriptionId){
    return this.http.put(this.apiEndpoint+`/payment/updateUserPayment/`+userSubscriptionId, data, this.httpHeaderOptions);
  }

  delete(type, id, companyId){
    return this.http.get(this.apiEndpoint+`/`+type+`/delete/`+id+`?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  shortlistDelete(type, id, companyId){
    return this.http.get(this.apiEndpoint+`/`+type+`/shortlistDelete/`+id+`?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  getMessagesChain(id){
    return this.http.get(this.apiEndpoint+`/message/list/`+id, this.httpHeaderOptions);
  }

  createMessageChain(data){
    return this.http.post(this.apiEndpoint+`/message/appendList`, data, this.httpHeaderOptions);
  }

  getWhoShortlistedMeList(companyId){
    return this.http.get(this.apiEndpoint+`/provider/shortlistedBy?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  searchWhoShortlistedMeList(companyId,searchText, name, location, minExp, maxExp){
    return this.http.get(this.apiEndpoint+`/provider/searchShortlistedByHirer?companyId=`+this.sanitizeParameter(companyId)
      + `&keyword=` + searchText + 
              `&name=`+name + `&location=`+location+
              `&minExperience=`+minExp + `&maxExperience=`+maxExp
      , this.httpHeaderOptions);
  }

  getIsUnreadMessageThere(id){
    return this.http.get(this.apiEndpoint+`/message/unread/`+id, this.httpHeaderOptions);
  }

  showVideoResource(folder, file, type){
    return this.http.get(this.apiEndpoint+`/download/`+folder+`/`+file, { headers: new HttpHeaders({
      'Authorization': this._token,
      'Content-Type': 'application/octet-stream',
      }), responseType: 'blob'}).pipe (
      tap (
        data => {
          //FileSaver.saveAs(data, file);
        },
        //error => //console.log(error)
      )
     );
  }
  getAddress(lat, lng){
    return this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=`+lat+`+`+lng+`&key=fc923b17aff94eeba35eaf4a091cb41b`);
  }

  // makePayment(paymentId, id, type, orderId, userSubscriptionId){
  //   return this.http.get(this.apiEndpoint+`/provider/paymentSuccess/`+id+`?paymentId=`+paymentId+`&type=`+type, this.httpHeaderOptions);
  // }

  createGigProcess(data, companyId){
    return this.http.post(this.apiEndpoint+`/gigProcess/create?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  checkIfMilestoneExist(data, companyId){
    return this.http.post(this.apiEndpoint+`/milestone/checkIfMilestoneExist?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  createMilestone(data, companyId){
    return this.http.post(this.apiEndpoint+`/milestone/create?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  updateMilestone(data, milestoneId, companyId){
    return this.http.put(this.apiEndpoint+`/milestone/update/`+milestoneId+`?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  sendForApproval(data, companyId){
    return this.http.post(this.apiEndpoint+`/milestone/sendForApproval?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  approveReject(data, companyId){
    return this.http.post(this.apiEndpoint+`/milestone/approveReject?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  startedMilestones(companyId){
    this.init();
    return this.http.get(this.apiEndpoint+`/milestone/startedMilestones?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  unreadNotification(data, companyId){
    return this.http.post(this.apiEndpoint+`/milestone/unreadNotification?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  startStopGig(data, companyId){
    return this.http.post(this.apiEndpoint+`/milestone/startStopGig?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  payForMilestone(data, companyId){
    return this.http.post(this.apiEndpoint+`/milestone/payForMilestone?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  disburseForMilestone(data, companyId){
    return this.http.post(this.apiEndpoint+`/milestone/disburseForMilestone?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  rechargeWallet(data, companyId){
    return this.http.post(this.apiEndpoint+`/wallet/recharge?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  updatePaymentWallet(data, userSubscriptionId, companyId){
    return this.http.put(this.apiEndpoint+`/wallet/update/`+userSubscriptionId+`?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderOptions);
  }

  init() {
    this._token = localStorage.getItem('_token');
    this.userId = localStorage.getItem('userId');
    this.httpHeaderOptions = {
  	  headers: new HttpHeaders({
  	    'Content-Type':  'application/json',
  	    'Authorization': this._token ? this._token : localStorage.getItem('admin_token')
  	  }),
      observe: 'response' as 'response'
    };
    this.httpHeaderUploadOptions = {
  	  headers: new HttpHeaders({
  	    //'Content-Type':  'multipart/form-data',
  	    'Authorization': this._token
  	  }),
      observe: 'response' as 'response'
    };
  }

  walletBalance(companyId){
    this.init();
    return this.http.get(this.apiEndpoint+`/wallet/balance?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  walletStatement(companyId, toDate, fromDate){
    return this.http.get(this.apiEndpoint+`/wallet/statement?fromDate=${fromDate}&toDate=${toDate}&companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  uploadVideo(data, companyId){
    return this.http.post(this.apiEndpoint+`/provider/upload/video?companyId=`+this.sanitizeParameter(companyId), data, this.httpHeaderUploadOptions);
  }

}
