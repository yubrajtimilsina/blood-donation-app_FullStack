# Chat Functionality Implementation Plan

## Issues Identified:
1. ChatModal components use event listeners instead of props for opening
2. FloatingChatWidget doesn't properly pass props to ChatModal
3. Socket authentication issues
4. Admin panel chat integration incomplete
5. Missing chat functionality for hospitals and admins

## Tasks:
- [ ] Fix ChatModal integration in PublicPortal
- [ ] Fix ChatModal integration in Admin Panel
- [ ] Update FloatingChatWidget to properly open ChatModal
- [ ] Fix socket authentication and connection
- [ ] Add chat functionality to admin panel pages
- [ ] Test chat between different user roles (donor-recipient, recipient-hospital, admin-user)
- [ ] Add proper error handling and loading states
- [ ] Ensure chat works in both portals
