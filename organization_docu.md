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
- The **"Organizations"** link in the sidebar (`AuthenticatedLayout.jsx`) is currently **Disabled** and labeled "Soon".
- The feature is fully functional but hidden from the main navigation.

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
