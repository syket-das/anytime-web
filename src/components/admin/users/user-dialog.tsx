"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserDialogProps {
  user: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDialog({ user, open, onOpenChange }: UserDialogProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Detailed information about the user.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-4 py-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback>{getInitials(user.name || "User")}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{user.name || "N/A"}</h3>
            <p className="text-sm text-muted-foreground">{user.email || "N/A"}</p>
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="banks">Banks</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">ID</p>
                <p className="text-sm text-muted-foreground break-all">{user.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Created At</p>
                <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Verified</p>
                <p className="text-sm">
                  {user.isVerified ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      No
                    </Badge>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Admin</p>
                <p className="text-sm">
                  {user.isAdmin ? (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800">
                      No
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="py-4">
            <p className="text-sm text-muted-foreground">Transaction history will be displayed here.</p>
          </TabsContent>

          <TabsContent value="banks" className="py-4">
            <p className="text-sm text-muted-foreground">User bank accounts will be displayed here.</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

