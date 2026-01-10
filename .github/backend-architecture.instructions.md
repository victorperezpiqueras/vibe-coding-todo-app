---
applyTo: "backend/**"
---

# Backend Architecture Guidelines

## Hexagonal Architecture

This backend follows **Hexagonal Architecture** (Ports and Adapters pattern).

### Directory Structure

Organize code into modules with a `shared` module for common functionality:

```txt
backend/
├── app/
│   ├── [module_name]/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── interfaces/
│   │   ├── application/
│   │   │   ├── use_cases/
│   │   │   └── dtos/
│   │   └── infrastructure/
│   │       ├── api/
│   │       ├── orm/
│   │       └── database/
│   └── shared/
│       ├── domain/
│       ├── application/
│       └── infrastructure/
```

### Layer Responsibilities

#### Domain Layer (`domain/`)

- **entities/**: Core business entities and domain models
- **interfaces/**: Repository interfaces and domain service interfaces
- **Rules**:
  - No dependencies on other layers
  - Pure business logic only
  - Framework-agnostic

#### Application Layer (`application/`)

- **use_cases/**: Application-specific business rules and orchestration
- **dtos/**: Data Transfer Objects for input/output
- **Rules**:
  - Can depend on domain layer
  - No dependencies on infrastructure layer
  - Defines interfaces that infrastructure implements

#### Infrastructure Layer (`infrastructure/`)

- **api/**: API endpoints, routers, request/response models (FastAPI)
- **orm/**: ORM models and mappings (SQLAlchemy, etc.)
- **database/**: Database connections, migrations, repositories
- **Rules**:
  - Implements interfaces defined in domain/application
  - Contains all framework-specific code
  - Depends on both domain and application layers

### Shared Module

The `shared/` module contains reusable code across all modules:

- Common domain entities
- Shared use cases
- Infrastructure utilities (database base classes, API utilities)

### Dependency Rule

Dependencies must flow inward:

```txt
Infrastructure → Application → Domain
```

- Domain has no dependencies
- Application depends only on Domain
- Infrastructure depends on both Application and Domain

### Examples

**Domain Entity:**

```python
# app/users/domain/entities/user.py
class User:
    def __init__(self, id: str, email: str, name: str):
        self.id = id
        self.email = email
        self.name = name
```

**Domain Interface:**

```python
# app/users/domain/interfaces/user_repository.py
from abc import ABC, abstractmethod
from ..entities.user import User

class UserRepository(ABC):
    @abstractmethod
    async def get_by_id(self, user_id: str) -> User | None:
        pass
```

**Application Use Case:**

```python
# app/users/application/use_cases/get_user.py
from ...domain.interfaces.user_repository import UserRepository
from ..dtos.user_dto import UserDTO

class GetUserUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def execute(self, user_id: str) -> UserDTO:
        user = await self.user_repository.get_by_id(user_id)
        return UserDTO.from_entity(user)
```

**Infrastructure API:**

```python
# app/users/infrastructure/api/user_router.py
from fastapi import APIRouter, Depends
from ...application.use_cases.get_user import GetUserUseCase

router = APIRouter()

@router.get("/users/{user_id}")
async def get_user(user_id: str, use_case: GetUserUseCase = Depends()):
    return await use_case.execute(user_id)
```

**Infrastructure Repository:**

```python
# app/users/infrastructure/database/user_repository_impl.py
from ...domain.interfaces.user_repository import UserRepository
from ...domain.entities.user import User

class UserRepositoryImpl(UserRepository):
    async def get_by_id(self, user_id: str) -> User | None:
        # Database implementation
        pass
```
