import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }

  milestoneRejectReasonModal = null;

  bindMilestoneRejectReasonModal(milestoneRejectReasonModal) {
    this.milestoneRejectReasonModal = milestoneRejectReasonModal;
  }

  openMilestoneRejectReasonModal(client,isApproved,userId) {
    this.milestoneRejectReasonModal.open(client,isApproved,userId);
  }

  closeMilestoneRejectReasonModal() {
    this.milestoneRejectReasonModal.close();
  }

  milestoneEditModal = null;

  bindMilestoneEditModal(milestoneEditModal) {
    this.milestoneEditModal = milestoneEditModal;
  }

  openMilestoneEditModal(uniqueId,client) {
    this.milestoneEditModal.open(uniqueId,client);
  }

  closeMilestoneEditModal() {
    this.milestoneEditModal.close();
  }

  endDateChangeModal = null;

  bindEndDateChangeModal(endDateChangeModal) {
    this.endDateChangeModal = endDateChangeModal;
  }

  openEndDateChangeModal(client) {
    this.endDateChangeModal.open(client);
  }

  closeEndDateChangeModal() {
    this.endDateChangeModal.close();
  }
}
