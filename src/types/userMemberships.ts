export interface MembershipFeature {
    courseTypeId: number;
    courseTypeName: string;
    sessionCount: number;
    remainSessionCount: number;
}

export interface CancelationOptions {
    hoursBeforeSession: number;
}

export interface UserMembership {
    membershipId: number;
    title: string;
    price: number;
    features: MembershipFeature[];
    cancelationOptions: CancelationOptions;
}