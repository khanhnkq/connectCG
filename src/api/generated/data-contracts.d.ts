/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreatProfileRequest {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  purpose?: string;
  occupation?: string;
  cityCode?: string;
  cityName?: string;
  hobbyIds?: number[];
  avatarUrl?: string;
  bio?: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface AuthSessionResponse {
  /** @format int32 */
  id?: number;
  username?: string;
  role?: string;
  hasProfile?: boolean;
  fullName?: string;
}
export interface RegisterRequest {
  /**
   * @minLength 3
   * @maxLength 20
   */
  username: string;
  /**
   * @minLength 6
   * @maxLength 100
   */
  password: string;
  email: string;
}
export interface GroupPostDTO {
  media?: MediaItem[];
  /** @format int32 */
  id?: number;
  /** @format int32 */
  groupId?: number;
  groupName?: string;
  content?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int32 */
  authorId?: number;
  authorName?: string;
  authorFullName?: string;
  authorAvatar?: string;
  images?: string[];
  approvedByFullName?: string;
  status?: string;
  originalPost?: GroupPostDTO;
  /** @format int32 */
  shareCount?: number;
  aiStatus?: string;
  /** @format double */
  aiScore?: number;
  aiReason?: string;
  visibility?: string;
  currentUserReaction?: string;
  /** @format int64 */
  reactCount?: number;
  /** @format int32 */
  commentCount?: number;
  /** @format date-time */
  authorLockedUntil?: string;
  authorPermanentLocked?: boolean;
  isPinned?: boolean;
  /** @format date-time */
  pinnedAt?: string;
}
export interface MediaItem {
  url?: string;
  thumbnailUrl?: string;
  type?: string;
  /** @format int32 */
  displayOrder?: number;
}
export interface ReactionRequest {
  /** @pattern LIKE|LOVE|HAHA|WOW|SAD|ANGRY */
  reaction: string;
}
export interface CreatePostRequest {
  /**
   * @minLength 0
   * @maxLength 5000
   */
  content: string;
  /**
   * @minLength 0
   * @maxLength 20
   * @pattern PUBLIC|FRIENDS|PRIVATE
   */
  visibility?: string;
  /** @format int32 */
  groupId?: number;
  /**
   * @maxItems 10
   * @minItems 0
   */
  mediaUrls?: string[];
}
export interface CreateCommentRequest {
  /**
   * @minLength 0
   * @maxLength 2000
   */
  content?: string;
  /** @format int32 */
  parentId?: number;
  /**
   * @minLength 0
   * @maxLength 2048
   */
  imageUrl?: string;
  contentOrImagePresent?: boolean;
}
export interface CommentDTO {
  /** @format int32 */
  id?: number;
  content?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int32 */
  authorId?: number;
  authorName?: string;
  authorAvatar?: string;
  /** @format int32 */
  parentId?: number;
  imageUrl?: string;
  replies?: CommentDTO[];
}
export interface GroupDTO {
  /** @format int32 */
  id?: number;
  name?: string;
  description?: string;
  privacy?: string;
  isDeleted?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format int32 */
  ownerId?: number;
  ownerName?: string;
  ownerFullName?: string;
  /** @format int32 */
  coverMediaId?: number;
  image?: string;
  currentUserStatus?: string;
  currentUserRole?: string;
  /** @format int64 */
  pendingRequestsCount?: number;
  /** @format int64 */
  pendingPostsCount?: number;
  /** @format int64 */
  memberCount?: number;
}
export interface TungGroupMemberDTO {
  /** @format int32 */
  userId?: number;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
  status?: string;
  /** @format date-time */
  joinedAt?: string;
}
export interface CreateGroup {
  /**
   * @minLength 3
   * @maxLength 100
   */
  name: string;
  /**
   * @minLength 0
   * @maxLength 500
   */
  description?: string;
  /** @pattern PUBLIC|PRIVATE */
  privacy: string;
  image?: string;
}
export interface ReportRequest {
  targetType?: string;
  /** @format int32 */
  targetId?: number;
  reason?: string;
}
export interface ReportResponse {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  reporterId?: number;
  targetType?: string;
  /** @format int32 */
  targetId?: number;
  reason?: string;
  status?: string;
  reporterUsername?: string;
  reviewerUsername?: string;
  /** @format int32 */
  groupId?: number;
  adminNote?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  resolvedAt?: string;
}
export interface ReportAdminUpdateRequest {
  status?: string;
  adminNote?: string;
}
export interface FriendDTO {
  /** @format int32 */
  id?: number;
  fullName?: string;
  username?: string;
  gender?: string;
  cityName?: string;
  avatarUrl?: string;
  /** @format date */
  dateOfBirth?: string;
  occupation?: string;
  relationshipStatus?: string;
}
export interface FriendRequestDTO {
  /** @format int32 */
  requestId?: number;
  /** @format int32 */
  senderId?: number;
  senderUsername?: string;
  senderFullName?: string;
  senderAvatarUrl?: string;
  /** @format date-time */
  createdAt?: string;
}
export interface ChatMemberDTO {
  /** @format int32 */
  id?: number;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
  /** @format date-time */
  lastReadAt?: string;
}
export interface ChatRoomDTO {
  /** @format int64 */
  id?: number;
  type?: string;
  name?: string;
  avatarUrl?: string;
  firebaseRoomKey?: string;
  /** @format int32 */
  otherParticipantId?: number;
  members?: ChatMemberDTO[];
  /** @format date-time */
  lastMessageAt?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int32 */
  unreadCount?: number;
  /** @format date-time */
  clientClearedAt?: string;
  currentUserRole?: string;
}
export interface HobbyDTO {
  /** @format int32 */
  id?: number;
  code?: string;
  name?: string;
  icon?: string;
  category?: string;
}
export interface MediaDTO {
  /** @format int32 */
  id?: number;
  url?: string;
  thumbnailUrl?: string;
  type?: string;
  /** @format int32 */
  sizeBytes?: number;
  /** @format date-time */
  uploadedAt?: string;
}
export interface UserProfileDTO {
  /** @format int32 */
  userId?: number;
  username?: string;
  email?: string;
  role?: string;
  isLocked?: boolean;
  fullName?: string;
  /** @format date */
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  occupation?: string;
  maritalStatus?: string;
  lookingFor?: string;
  cityCode?: string;
  cityName?: string;
  currentAvatarUrl?: string;
  currentCoverUrl?: string;
  gallery?: MediaDTO[];
  hobbies?: HobbyDTO[];
  /** @format int32 */
  friendsCount?: number;
  /** @format int32 */
  postsCount?: number;
  relationshipStatus?: string;
  isFriend?: boolean;
  /** @format date-time */
  lockedUntil?: string;
  permanentLocked?: boolean;
}
export interface MemberSearchResponse {
  /** @format int32 */
  userId?: number;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  cityName?: string;
  gender?: string;
  maritalStatus?: string;
  lookingFor?: string;
  isFriend?: boolean;
  requestSent?: boolean;
  /** @format int32 */
  requestId?: number;
  isRequestReceiver?: boolean;
  /** @format int64 */
  mutualFriends?: number;
}
export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  occupation?: string;
  maritalStatus?: string;
  lookingFor?: string;
  gender?: string;
  /** @format date */
  dateOfBirth?: string;
  cityCode?: string;
  cityName?: string;
}
export interface TungNotificationDTO {
  /** @format int32 */
  id?: number;
  content?: string;
  type?: string;
  targetType?: string;
  /** @format int32 */
  targetId?: number;
  isRead?: boolean;
  /** @format date-time */
  createdAt?: string;
  actorName?: string;
  actorAvatar?: string;
}
export interface MediaUploadResponse {
  /** @format int32 */
  mediaId?: number;
  objectKey?: string;
  url?: string;
  contentType?: string;
  /** @format int32 */
  size?: number;
  thumbnailUrl?: string;
}
export interface AuthForgotPasswordParams {
  email: string;
}
export interface AuthResetPasswordParams {
  token: string;
  newPassword: string;
}
export interface AuthVerifyEmailParams {
  token: string;
}
export interface PostGetNewsfeedPostsParams {
  /** @format int32 */
  page: number;
  /** @format int32 */
  size: number;
}
export interface PostGetPendingHomepagePostsParams {
  /** @format int32 */
  page: number;
  /** @format int32 */
  size: number;
}
export interface PostGetAuditHomepagePostsParams {
  /** @format int32 */
  page: number;
  /** @format int32 */
  size: number;
}
export interface PostApprovePostParams {
  /** @format int32 */
  id: number;
}
export interface PostReactToPostParams {
  /** @format int32 */
  id: number;
}
export interface PostUnReactToPostParams {
  /** @format int32 */
  id: number;
}
export interface PostGetPostByIdParams {
  /** @format int32 */
  id: number;
}
export interface PostUpdatePostParams {
  /** @format int32 */
  id: number;
}
export interface PostDeletePostParams {
  /** @format int32 */
  id: number;
}
export interface PostGetUserProfilePostsParams {
  /** @format int32 */
  id: number;
}
export interface PostGetPublicHomepagePostsParams {
  /** @format int32 */
  page: number;
  /** @format int32 */
  size: number;
}
export interface PostRejectPostParams {
  /** @format int32 */
  id: number;
}
export interface PostSharePostParams {
  /** @format int32 */
  id: number;
}
export interface CommentGetCommentsParams {
  /** @format int32 */
  postId: number;
}
export interface CommentCreateCommentParams {
  /** @format int32 */
  postId: number;
}
export interface CommentDeleteCommentParams {
  /** @format int32 */
  postId: number;
  /** @format int32 */
  commentId: number;
}
export interface GroupApprovePostParams {
  /** @format int32 */
  id: number;
  /** @format int32 */
  postId: number;
}
export interface GroupGetPendingPostsParams {
  /** @format int32 */
  id: number;
}
export interface GroupSearchGroupsParams {
  name: string;
}
export interface GroupGetByIdParams {
  /** @format int32 */
  id: number;
}
export interface GroupUpdateParams {
  /** @format int32 */
  id: number;
}
export interface GroupDeleteGroupParams {
  /** @format int32 */
  id: number;
}
export interface GroupInviteMembersParams {
  /** @format int32 */
  id: number;
}
export interface GroupAcceptInvitationParams {
  /** @format int32 */
  id: number;
}
export interface GroupDeclineInvitationParams {
  /** @format int32 */
  id: number;
}
export interface GroupApproveJoinRequestParams {
  /** @format int32 */
  id: number;
  /** @format int32 */
  userId: number;
}
export interface GroupRejectJoinRequestParams {
  /** @format int32 */
  id: number;
  /** @format int32 */
  userId: number;
}
export interface GroupGetPendingJoinRequestsParams {
  /** @format int32 */
  id: number;
}
export interface GroupTransferOwnershipParams {
  /** @format int32 */
  id: number;
}
export interface GroupUpdateMemberRoleParams {
  /** @format int32 */
  id: number;
  /** @format int32 */
  userId: number;
}
export interface GroupGetBannedMembersParams {
  /** @format int32 */
  id: number;
}
export interface GroupUnbanMemberParams {
  /** @format int32 */
  id: number;
  /** @format int32 */
  userId: number;
}
export interface GroupTogglePinPostParams {
  /** @format int32 */
  id: number;
  /** @format int32 */
  postId: number;
}
export interface GroupGetGroupPostsParams {
  /** @format int32 */
  id: number;
}
export interface GroupRejectPostParams {
  /** @format int32 */
  id: number;
  /** @format int32 */
  postId: number;
}
export interface GroupLeaveGroupParams {
  /** @format int32 */
  id: number;
}
export interface GroupJoinGroupParams {
  /** @format int32 */
  id: number;
}
export interface GroupBanMemberParams {
  /** @format int32 */
  id: number;
  /** @format int32 */
  userId: number;
}
export interface GroupGetMembersParams {
  /** @format int32 */
  id: number;
}
export interface ReportGetReportsParams {
  status?: string;
  targetType?: string;
  /** @format int32 */
  page: number;
  /** @format int32 */
  size: number;
}
export interface ReportGetReportDetailParams {
  /** @format int32 */
  id: number;
}
export interface ReportUpdateReportStatusParams {
  /** @format int32 */
  id: number;
}
export interface FriendrestGetFriendsByUserIdParams {
  name?: string;
  gender?: string;
  cityCode?: string;
  /** @format int32 */
  userId: number;
}
export interface FriendrestGetMyFriendsParams {
  name?: string;
  gender?: string;
  cityCode?: string;
}
export interface FriendrestUnfriendParams {
  /** @format int32 */
  friendId: number;
}
export interface FriendrequestGetPendingRequestsParams {
  /** @format int32 */
  page: number;
  /** @format int32 */
  size: number;
}
export interface FriendrequestAcceptRequestParams {
  /** @format int32 */
  requestId: number;
}
export interface FriendrequestRejectRequestParams {
  /** @format int32 */
  requestId: number;
}
export interface FriendrequestSendRequestParams {
  /** @format int32 */
  receiverId: number;
}
export interface FriendrequestCancelRequestParams {
  /** @format int32 */
  receiverId: number;
}
export interface FriendsuggestionGetSuggestionsParams {
  /** @format int32 */
  page: number;
  /** @format int32 */
  size: number;
}
export interface FriendsuggestionDismissSuggestionParams {
  /** @format int32 */
  dismissedUserId: number;
}
export interface ChatRenameRoomParams {
  /** @format int32 */
  roomId: number;
}
export interface ChatInviteMembersParams {
  /** @format int32 */
  roomId: number;
}
export interface ChatGetOrCreateDirectChatParams {
  /** @format int32 */
  targetUserId: number;
}
export interface ChatUpdateAvatarParams {
  /** @format int32 */
  roomId: number;
}
export interface ChatRemoveMemberParams {
  /** @format int32 */
  roomId: number;
  /** @format int32 */
  userId: number;
}
export interface ChatClearHistoryParams {
  /** @format int32 */
  roomId: number;
}
export interface ChatMarkAsReadParams {
  /** @format int32 */
  roomId: number;
}
export interface ChatLeaveRoomParams {
  /** @format int32 */
  roomId: number;
}
export interface ChatDeleteRoomParams {
  /** @format int32 */
  roomId: number;
}
export interface UserprofileGetUserProfileParams {
  /** @format int32 */
  userId: number;
}
export interface UserprofileSearchMembersParams {
  keyword?: string;
  gender?: string;
  cityCode?: string;
  maritalStatus?: string;
  lookingFor?: string;
  /** @format int32 */
  page: number;
  /** @format int32 */
  size: number;
}
export interface TungnotificationGetMyNotificationsParams {
  /** @format int32 */
  page: number;
  /** @format int32 */
  size: number;
}
export interface TungnotificationDeleteNotificationParams {
  /** @format int32 */
  id: number;
}
export interface TungnotificationMarkAsReadParams {
  /** @format int32 */
  id: number;
}
export interface MediauploadUploadParams {
  file: string;
  category: string;
  thumbnail?: string;
}
export interface AdminusermanagerGetAllUsersParams {
  keyword?: string;
  role?: string;
}
export interface AdminusermanagerUpdateRoleParams {
  /** @format int32 */
  userId: number;
}
export interface AdminusermanagerToggleLockParams {
  /** @format int32 */
  userId: number;
}
export interface AdminusermanagerDeleteUserParams {
  /** @format int32 */
  userId: number;
}
