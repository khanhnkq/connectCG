import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Users, MagnifyingGlass as Search } from "@phosphor-icons/react";
import { useGroupsManagement } from "../../features/groups/hooks/useGroupsManagement";
import { GroupCard } from "../../features/groups/components/GroupCard";
import { GroupsRightSidebar } from "../../features/groups/components/GroupsRightSidebar";
import { GroupsTabs } from "../../features/groups/components/GroupsTabs";
import { Button } from "../../components/ui/button/Button";
import { Input } from "../../components/ui/input/Input";
import { Skeleton, EmptyState } from "../../components/ui/feedback/Skeleton";

/**
 * Modern Flat GroupsManagement Page
 * Orchestrates the Groups feature using useGroupsManagement hook and standard UI components.
 */
export default function GroupsManagement() {
  const navigate = useNavigate();
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    managedGroups,
    joinedGroups,
    pendingInvitations,
    displayedGroups,
    loading,
    isFetchingMore,
    hasMore,
    loaderRef,
    handleTabChange,
    handleAcceptInvite,
    handleDeclineInvite,
    handleJoinGroup,
    handleCancelJoinRequest,
    checkIfAdmin,
    filteredGroups,
  } = useGroupsManagement();

  return (
    <div className="flex w-full relative items-start transition-colors duration-200">
      <div className="flex-1 w-full bg-background-main min-h-screen">
        {/* Sticky Flat Header */}
        <header className="sticky top-0 z-30 bg-background-main border-0 p-3 md:p-4 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-3">
          {/* Tabs */}
          <div className="w-full md:w-auto">
            <GroupsTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              pendingInvitationsCount={pendingInvitations.length}
            />
          </div>

          {/* Search (Mobile/Tablet) & Create Button */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex-1 md:w-72 xl:hidden">
              <Input
                id="groups-top-search"
                leftIcon={Search}
                placeholder="Tìm kiếm nhóm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/dashboard/groups/create">
              <Button variant="primary" size="md" className="rounded-xl font-bold whitespace-nowrap">
                Tạo nhóm
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="px-4 md:px-8 py-6 md:py-8">
          {/* Search Result Banner */}
          {searchQuery.trim() !== "" && (
            <div className="mb-6 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Search size={16} />
              <span>
                Tìm thấy{" "}
                {activeTab === "my"
                  ? filteredGroups(managedGroups).length + filteredGroups(joinedGroups).length
                  : filteredGroups(displayedGroups).length}{" "}
                kết quả cho "{searchQuery}"
              </span>
            </div>
          )}

          {loading ? (
            /* Loading State Skeleton */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border-0 rounded-2xl bg-surface-main overflow-hidden p-0 space-y-4 shadow-sm">
                  <Skeleton className="h-44 w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="pt-2 flex gap-2">
                      <Skeleton className="h-10 flex-1 rounded-xl" />
                      <Skeleton className="size-10 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "my" ? (
            /* Tab: Của tôi (My Groups) */
            <div className="space-y-10">
              {/* Managed Groups Section */}
              {managedGroups.length > 0 && (
                <section className="space-y-5">
                  <div className="flex items-center gap-3 border-0 pb-3">
                    <ShieldCheck className="text-primary size-6 shrink-0" />
                    <h2 className="text-base font-bold text-text-main uppercase tracking-wider">
                      Nhóm bạn quản lý ({filteredGroups(managedGroups).length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups(managedGroups).map((group) => (
                      <GroupCard
                        key={group.id}
                        group={group}
                        activeTab={activeTab}
                        isAdmin={true}
                        onNavigate={navigate}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Joined Groups Section */}
              {joinedGroups.length > 0 && (
                <section className="space-y-5">
                  <div className="flex items-center gap-3 border-0 pb-3">
                    <Users className="text-primary size-6 shrink-0" />
                    <h2 className="text-base font-bold text-text-main uppercase tracking-wider">
                      Nhóm bạn tham gia ({filteredGroups(joinedGroups).length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups(joinedGroups).map((group) => (
                      <GroupCard
                        key={group.id}
                        group={group}
                        activeTab={activeTab}
                        isAdmin={false}
                        onNavigate={navigate}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Empty State for My Groups */}
              {managedGroups.length === 0 && joinedGroups.length === 0 && (
                <EmptyState
                  icon={Users}
                  title="Bạn chưa tham gia nhóm nào"
                  description="Hãy tham gia hoặc khởi tạo một cộng đồng mới để kết nối cùng các chuyên gia khác."
                  action={
                    <Button
                      variant="primary"
                      size="md"
                      className="rounded-xl"
                      onClick={() => handleTabChange("discover")}
                    >
                      Khám phá nhóm
                    </Button>
                  }
                />
              )}
            </div>
          ) : (
            /* Tabs: Khám phá & Lời mời (Discover & Invites) */
            <>
              {filteredGroups(displayedGroups).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups(displayedGroups).map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      activeTab={activeTab}
                      isAdmin={checkIfAdmin(group)}
                      onAccept={handleAcceptInvite}
                      onDecline={handleDeclineInvite}
                      onJoin={handleJoinGroup}
                      onCancelRequest={handleCancelJoinRequest}
                      onNavigate={navigate}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title={activeTab === "discover" ? "Không tìm thấy nhóm phù hợp" : "Không có lời mời nào"}
                  description={
                    activeTab === "discover"
                      ? "Không tìm thấy kết quả phù hợp với tiêu chí tìm kiếm của bạn."
                      : "Bạn hiện không có lời mời tham gia nhóm nào đang chờ xử lý."
                  }
                />
              )}
            </>
          )}

          {/* Infinite Scroll Sentinel */}
          <div ref={loaderRef} className="py-8 flex justify-center w-full">
            {isFetchingMore ? (
              <div className="size-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            ) : (
              !hasMore &&
              !loading && (
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider select-none">
                  Bạn đã xem hết tất cả
                </span>
              )
            )}
          </div>
        </main>
      </div>

      {/* Right Sidebar */}
      <GroupsRightSidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        displayedGroupsLength={
          activeTab === "my"
            ? managedGroups.length + joinedGroups.length
            : displayedGroups.length
        }
      />
    </div>
  );
}
