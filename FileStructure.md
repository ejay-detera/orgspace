# OrgSpace File Structure & Naming Conventions

This document outlines the file structure and naming conventions used throughout the OrgSpace project to maintain consistency and readability.

## 📁 General Conventions

### Folder Names
- **Must be plural** (e.g., `Pages`, `Components`, `Layouts`)
- **Use PascalCase** (e.g., `Organizations`, `Users`, `Events`)

### File Names
- **Must be singular** (e.g., `Index.jsx`, `Create.jsx`, `Show.jsx`)
- **Use PascalCase** (e.g., `AuthenticatedLayout.jsx`, `OrganizationForm.jsx`)

### Functions
- **Use CamelCase** (e.g., `getUserData()`, `handleFormSubmit()`, `validateEmail()`)

### Database Files
- **Migrations**: Use SnakeCase (e.g., `create_organizations_table.php`)
- **Models**: Use PascalCase singular (e.g., `Organization.php`, `User.php`)

### UI Components
- **Under `ui/` folder**: Use KebabCase (e.g., `button.jsx`, `input.jsx`, `card.jsx`)

## 📂 Project Structure

```
resources/
├── js/
│   ├── Components/                 # Reusable components (plural folder)
│   │   ├── ui/                   # Shadcn/ui components (KebabCase files)
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── card.jsx
│   │   │   └── label.jsx
│   │   ├── Dropdown.jsx           # PascalCase file
│   │   ├── Modal.jsx
│   │   └── ApplicationLogo.jsx
│   ├── Layouts/                  # Layout components (plural folder)
│   │   ├── AuthenticatedLayout.jsx # PascalCase file
│   │   └── GuestLayout.jsx
│   ├── Pages/                     # Page components (plural folder)
│   │   ├── Auth/                 # Authentication pages (plural folder)
│   │   │   ├── Login.jsx          # PascalCase file
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── Profile/               # Profile pages (plural folder)
│   │   │   ├── Edit.jsx
│   │   │   └── Partials/         # Partial components (plural folder)
│   │   │       ├── DeleteUserForm.jsx
│   │   │       ├── UpdatePasswordForm.jsx
│   │   │       └── UpdateProfileInformationForm.jsx
│   │   ├── Organizations/          # Feature pages (plural folder)
│   │   │   ├── Index.jsx         # Main list page (singular file)
│   │   │   ├── Create.jsx        # Form page (singular file)
│   │   │   ├── Show.jsx          # Detail page (singular file)
│   │   │   ├── Edit.jsx          # Edit page (singular file)
│   │   │   └── Components/       # Feature-specific components
│   │   │       ├── OrganizationForm.jsx
│   │   │       └── OrganizationCard.jsx
│   │   ├── Dashboard.jsx           # Single page (PascalCase)
│   │   ├── Welcome.jsx
│   │   └── LandingPage.jsx
│   ├── lib/                      # Utility libraries (singular folder)
│   │   └── utils.js              # Utility functions (camelCase)
│   ├── app.jsx                   # Main application file
│   └── bootstrap.js              # Bootstrap file
├── css/
│   └── app.css                   # Main stylesheet
└── views/
    └── app.blade.php             # Main layout template
```

## 🗄️ Database Structure

```
database/
├── migrations/                    # Migration files (plural folder)
│   ├── 0001_01_01_000000_create_users_table.php  # SnakeCase
│   ├── 0001_01_01_000001_create_organizations_table.php
│   └── 0001_01_01_000002_create_events_table.php
├── seeders/                      # Seeder files (plural folder)
│   ├── DatabaseSeeder.php
│   └── OrganizationSeeder.php
└── factories/                    # Factory files (plural folder)
    ├── UserFactory.php
    └── OrganizationFactory.php
```

## 📝 Naming Examples

### Pages/Features Structure
For each feature (e.g., Organizations), follow this pattern:

```
Pages/
└── Organizations/                 # Plural folder name
    ├── Index.jsx                 # List all organizations
    ├── Create.jsx                # Create new organization form
    ├── Show.jsx                  # View single organization
    ├── Edit.jsx                  # Edit existing organization
    └── Components/               # Feature-specific components
        ├── OrganizationForm.jsx     # Form component
        ├── OrganizationCard.jsx    # Display card component
        └── OrganizationList.jsx   # List component
```

### Component Naming
```javascript
// ✅ Correct - PascalCase file name
const OrganizationForm = () => {
    // ✅ Correct - CamelCase function names
    const handleSubmit = () => {
        // ✅ Correct - CamelCase variable names
        const formData = getFormData();
        validateOrganizationData(formData);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            {/* Form content */}
        </form>
    );
};

export default OrganizationForm;
```

### UI Components (KebabCase)
```
Components/ui/
├── button.jsx          # ✅ KebabCase
├── input.jsx           # ✅ KebabCase
├── card.jsx            # ✅ KebabCase
├── dropdown.jsx        # ✅ KebabCase
└── modal.jsx           # ✅ KebabCase
```

## 🔧 Function Naming Conventions

### Event Handlers
```javascript
// ✅ Correct - CamelCase with "handle" prefix
const handleFormSubmit = () => {};
const handleInputChange = () => {};
const handleButtonClick = () => {};
```

### Utility Functions
```javascript
// ✅ Correct - CamelCase descriptive names
const getUserData = () => {};
const validateEmail = () => {};
const formatDateString = () => {};
const calculateTotal = () => {};
```

### Database Functions
```javascript
// ✅ Correct - CamelCase with descriptive action
const createOrganization = () => {};
const updateOrganization = () => {};
const deleteOrganization = () => {};
const findOrganizationById = () => {};
```

## 📋 Migration Naming

### Migration Files (SnakeCase)
```php
// ✅ Correct - SnakeCase migration names
2024_02_14_000000_create_users_table.php
2024_02_14_000001_create_organizations_table.php
2024_02_14_000002_add_foreign_key_to_organizations_table.php
2024_02_14_000003_create_organization_members_table.php
```

### Migration Class Names
```php
// ✅ Correct - PascalCase class names
class CreateUsersTable extends Migration {}
class CreateOrganizationsTable extends Migration {}
class AddForeignKeyToOrganizationsTable extends Migration {}
```

## 🎯 Quick Reference

| Type | Convention | Example |
|------|------------|---------|
| **Folder** | Plural PascalCase | `Organizations/`, `Users/`, `Events/` |
| **File** | Singular PascalCase | `Organization.jsx`, `User.jsx`, `Event.jsx` |
| **UI File** | KebabCase | `button.jsx`, `input.jsx`, `card.jsx` |
| **Function** | CamelCase | `getUserData()`, `handleSubmit()` |
| **Migration** | SnakeCase | `create_organizations_table.php` |
| **Model** | Singular PascalCase | `Organization.php`, `User.php` |

## ✅ Best Practices

1. **Be Consistent**: Always follow the established conventions
2. **Be Descriptive**: Use clear, meaningful names
3. **Keep it Simple**: Avoid overly complex naming
4. **Think Scalability**: Choose names that work as the project grows
5. **Use Comments**: Document complex naming decisions when necessary

Following these conventions ensures:
- **Readability**: Code is easy to understand
- **Maintainability**: Easy to locate and modify files
- **Collaboration**: Team members can navigate code efficiently
- **Scalability**: Structure works as project grows
