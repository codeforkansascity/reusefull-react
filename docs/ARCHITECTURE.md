# Reusefull Application Architecture

## Overview
This document provides visual diagrams of the Reusefull application architecture, data flow, and caching strategy.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Browser"
        User[?? User]
        React[React SPA<br/>TanStack Router]
        RQ[React Query Cache<br/>staleTime: 2hrs<br/>localStorage]
        Auth0Client[Auth0 Client<br/>Authentication]
    end
    
    subgraph "AWS Lambda Functions"
        LambdaItems[GetItemTypesNode<br/>Lambda Function URL]
        LambdaCategories[GetCharityTypesNode<br/>Lambda Function URL]
        LambdaOrgs[GetOrgsNode<br/>Lambda Function URL]
        LambdaOrgItems[GetOrgItemsNode<br/>Lambda Function URL]
        LambdaOrgTypes[GetOrgTypesNode<br/>Lambda Function URL]
    end
    
    subgraph "AWS RDS"
        MySQL[(MySQL Database<br/>IAM Auth)]
    end
    
    subgraph "Auth0"
        Auth0Service[Auth0 Service<br/>JWT Tokens]
    end

    User -->|Navigate| React
    React -->|Query Data| RQ
    RQ -->|Cache Miss| LambdaItems
    RQ -->|Cache Miss| LambdaCategories
    RQ -->|Cache Miss| LambdaOrgs
    RQ -->|Cache Miss| LambdaOrgItems
    RQ -->|Cache Miss| LambdaOrgTypes
    
    React -->|Login/Signup| Auth0Client
    Auth0Client <-->|OAuth 2.0| Auth0Service
    
    LambdaItems -->|IAM Auth| MySQL
    LambdaCategories -->|IAM Auth| MySQL
    LambdaOrgs -->|IAM Auth| MySQL
    LambdaOrgItems -->|IAM Auth| MySQL
    LambdaOrgTypes -->|IAM Auth| MySQL
    
    style RQ fill:#90EE90
    style MySQL fill:#4169E1
    style Auth0Service fill:#EB5424
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant React
    participant ReactQuery as React Query Cache
    participant Lambda as Lambda Function
    participant MySQL as MySQL DB

    User->>React: Navigate to /donate
    React->>ReactQuery: Request items & categories
    
    alt Cache Hit (< 2 hours)
        ReactQuery-->>React: Return cached data
    else Cache Miss or Stale
        ReactQuery->>Lambda: HTTP GET Request
        Lambda->>MySQL: Query with IAM Auth
        MySQL-->>Lambda: Return results
        Lambda-->>ReactQuery: JSON Response
        ReactQuery->>ReactQuery: Store in cache (2hrs)
        ReactQuery-->>React: Return fresh data
    end
    
    React-->>User: Render page
    
    User->>React: Navigate to /results
    Note over ReactQuery: Categories already cached!
    ReactQuery-->>React: Return from cache (instant)
    React-->>User: Render instantly
```

## React Query Caching Strategy

```mermaid
graph LR
    subgraph "Query Configuration"
        Config[staleTime: 2 hours<br/>gcTime: 3 hours<br/>refetchOnWindowFocus: false]
    end
    
    subgraph "Cache States"
        Fresh[Fresh<br/>< 2 hours]
        Stale[Stale<br/>> 2 hours]
        Garbage[Garbage Collected<br/>> 3 hours unused]
    end
    
    subgraph "Actions"
        UseCache[Use Cache<br/>No API Call]
        Background[Background Refetch<br/>Show stale data]
        FreshFetch[Fresh Fetch<br/>Show loading]
    end
    
    Config --> Fresh
    Fresh --> UseCache
    Fresh -->|After 2 hrs| Stale
    Stale --> Background
    Stale -->|After 3 hrs unused| Garbage
    Garbage --> FreshFetch
```

## Application Routes

```mermaid
graph TD
    Root[__root.tsx<br/>Auth0 + React Query]
    
    Root --> Home[/index.tsx<br/>Home Page]
    Root --> Donate[/donate/index.tsx<br/>Donation Form]
    Root --> Results[/donate/results.tsx<br/>Results Page]
    Root --> Charity[/charity/$charityId.tsx<br/>Charity Detail]
    Root --> Admin[/admin/index.tsx<br/>Admin Panel]
    Root --> SignupStep1[/charity/signup/step/1.tsx]
    Root --> SignupStep2[/charity/signup/step/2.tsx]
    Root --> SignupStep3[/charity/signup/step/3.tsx]
    
    Donate -->|ensureQueryData| ItemsQuery[itemsQuery<br/>categoriesQuery]
    Results -->|ensureQueryData| OrgsQuery[orgsQuery<br/>orgItemsQuery]
    Charity -->|ensureQueryData| CharityQuery[orgsQuery<br/>orgCharityTypesQuery]
    
    style ItemsQuery fill:#FFE4B5
    style OrgsQuery fill:#FFE4B5
    style CharityQuery fill:#FFE4B5
```

## Lambda Function Structure

```mermaid
graph TD
    subgraph "Lambda Function Pattern"
        Handler[exports.handler]
        Config[getDbConfig<br/>Environment Variables]
        ConnString[getConnectionString<br/>IAM Token Generation]
        Query[MySQL Query Execution]
        Response[JSON String Response]
        Error[Error Handling]
    end
    
    Handler --> Config
    Config --> ConnString
    ConnString --> Query
    Query --> Response
    Query -->|On Error| Error
    
    style Response fill:#90EE90
    style Error fill:#FF6B6B
```

## Technology Stack

### Frontend
- **React** - UI framework
- **TanStack Router** - Client-side routing
- **React Query** - Data fetching & caching
- **Auth0** - Authentication
- **Tailwind CSS** - Styling

### Backend
- **AWS Lambda** - Serverless functions (Node.js)
- **Lambda Function URLs** - HTTP endpoints
- **AWS RDS** - MySQL database
- **IAM Authentication** - Secure database access

### Data Flow
1. User navigates to a route
2. Router loader calls `queryClient.ensureQueryData()`
3. React Query checks cache
4. If cache miss, calls Lambda Function URL
5. Lambda generates IAM auth token
6. Lambda queries MySQL with IAM auth
7. Response cached in localStorage for 2 hours
8. Future navigations use cached data

## Deployment

### CI/CD Pipeline
- **GitHub Actions** - Automated deployment
- **Lambda Node.js Functions** - Auto-deploy on push
- Workflow files in `.github/workflows/`

### Lambda Functions
- `GetItemTypesNode` - Fetches donation items
- `GetCharityTypesNode` - Fetches charity categories
- `GetOrgsNode` - Fetches organizations
- `GetOrgItemsNode` - Fetches org-item relationships
- `GetOrgTypesNode` - Fetches org-type relationships

## Security

### Authentication
- OAuth 2.0 via Auth0
- JWT tokens stored in localStorage
- Refresh tokens enabled

### Database Access
- IAM authentication (no passwords)
- RDS Signer generates temporary tokens
- SSL/TLS encrypted connections

### CORS
- Configured in Lambda functions
- Wildcard origin (`*`) for public APIs
