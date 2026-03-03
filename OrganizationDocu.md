# Organization Module Documentation

## Overview
This document outlines the implementation details for the **Organization Creation** feature in the OrgSpace application. This feature allows authenticated users to create new organizations, automatically setting up the necessary structure and permissions.

## User Story & Requirements
**User Story**: "As a user, I want to be able to create an organization."

**Acceptance Criteria**:
- Authenticated user can create an organization.
- Organization name must be unique.
- User automatically becomes **Founder/President**.
- A default **Executive Committee** is created.
- System ensures data isolation.

## Architecture

### Database Schema
1.  **organizations**
    - `id`: PK
    - `name`: Unique, String
    - `description`: Text
    - `type`: String (e.g., Tech Society, Student Govt)
    - `status`: String (Default: 'active')
    - `organization_code`: Unique reference code
    - `created_by`: Foreign Key (User)
    - `timestamps`

2.  **organization_members** (Pivot Table)
    - `id`: PK
    - `user_id`: Foreign Key (User)
    - `organization_id`: Foreign Key (Organization)
    - `role`: String (e.g., 'President', 'Member')
    - `status`: String (e.g., 'active')
    - `timestamps`

3.  **committee**
    - `id`: PK
    - `name`: String ('Executive Committee' by default)
    - `organization_id`: Foreign Key (Organization)
    - `is_public`: Boolean (Default: false)

### Models & Relationships
- **User**
    - `hasMany` Organization (as creator)
    - `belongsToMany` Organization (as member via `organization_members`)
- **Organization**
    - `belongsTo` User (creator)
    - `hasMany` Committee
    - `belongsToMany` User (members via `organization_members`)
- **Committee**
    - `belongsTo` Organization

## Implementation Details

### Backend Logic
The core logic resides in `App\Http\Controllers\OrganizationController@store`.
It uses a **Database Transaction** to ensure atomicity:
1.  **Create Organization**: Inserts the new organization record.
2.  **Create Default Committee**: Automatically creates the "Executive Committee".
3.  **Assign Creator Role**: Attaches the current user to the organization with the role of **'President'**.

### Routes
**Web Routes (`routes/web.php`)**:
- `GET /organizations/create`: Renders the React creation form.
- `POST /organizations`: Handles the form submission and creation logic.

### Frontend
The creation UI is located at `resources/js/Pages/Organization/Create.jsx`.
- It uses `AuthenticatedLayout` to integrate seamlessly with the dashboard.
- It includes form validation feedback.

**Current Status**:
- The **"Organizations"** link in the sidebar (`AuthenticatedLayout.jsx`) is enabled and functional.
- The creation form now supports uploading an image/logo for the organization.
- Uploaded images are stored in the `public/organizations` storage disk.

## Testing
An automated Feature Test exists: `tests/Feature/OrganizationTest.php`.
To run the tests:
```bash
php artisan test tests/Feature/OrganizationTest.php
```
This test verifies:
- Database record creation.
- Correct role assignment.
- Default committee creation.
- Validation logic.

## Join Organization Feature

### Backend Logic
- `GET /organizations/discover`: Displays all active organizations to the user. Matches by name or code.
- `POST /organizations/{organization}/join`: Validates user is not already a member (even pending), attaches user to `organization_members` with `role = 'Member'` and `status = 'pending'`.
- `GET /organizations/{organization}/requests`: Displays pending join requests for the given organization.
- `POST /organizations/{organization}/approve/{user}`: Changes pivot status from 'pending' to 'active'.
- `POST /organizations/{organization}/reject/{user}`: Removes the pending record from `organization_members`.

### Security (Policies)
- **`OrganizationPolicy`**: Ensures only a user with an active `'President'` role in a specific organization can view, approve, or reject its join requests.

### Frontend
- **Discover Organizations (`Discover.jsx`)**: A searchable page allowing users to find organizations and send join requests.
- **Manage Requests (`Requests.jsx`)**: A dashboard exclusively for Presidents to review, approve, or reject applicant requests.
- **Index Dashboard (`Index.jsx`)**:
  - Displays a "Pending" tag on organizations waiting for approval.
  - Shows the user's specific role (e.g., "Member", "President") if approved.
  - Displays an exclusive "Manage Join Requests" button for Presidents.

### Testing
- Automated feature tests exist in `tests/Feature/JoinOrganizationTest.php` covering the entire workflow (searching, joining, rejecting, authorizing approvals).
