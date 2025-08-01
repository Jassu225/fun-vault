# Firebase Admin SDK Integration

## Product Requirements Document (PRD)

**Reference**: This feature aligns with the Master PRD at `/ai/specs/prd.md`

### Overview

Implement a streamlined Firebase Admin SDK integration that provides direct access to Firestore operations for both production and testing environments, with proper emulator support for testing scenarios.

### Alignment with Product Vision

This implementation supports the core principle of maintaining robust, testable code while using the Firebase Admin SDK consistently across all environments. It ensures our backend operations can be thoroughly tested with security rules enforcement while maintaining production efficiency.

### Business Context

- **Problem**: Previous unified abstraction layer created unnecessary complexity and potential conflicts between different SDKs
- **Target users**: Backend developers, test engineers
- **Success metrics**: 100% test coverage with security rules validation, zero production regressions
- **Business value**: Simplified architecture, improved maintainability, better security testing

### Core Requirements

- **Must-have features**:
  - Direct Firebase Admin SDK integration for all environments
  - Environment-based configuration (production vs testing)
  - Emulator support for testing with security rules
  - TypeScript support with proper typing
  - Service account handling for production

- **Nice-to-have features**:
  - Batch operations support
  - Transaction support
  - Error handling with proper error types
  - Logging and monitoring

- **Out of scope**:
  - Real-time listeners (not needed for backend operations)
  - Authentication management (handled separately)
  - Client SDK integration (removed for simplicity)

## User Stories

- As a backend developer, I want to use Firebase Admin SDK consistently across all environments
- As a test engineer, I want to test backend functions with security rules enforcement using the emulator
- As a developer, I want a simple, direct API that doesn't abstract away the Firebase Admin SDK

## Acceptance Criteria

- Given the environment is production, when I call Firestore operations, then it uses Admin SDK with service account
- Given the environment is testing, when I call Firestore operations, then it uses Admin SDK with emulator
- Given I'm in a test environment, when I try to write to a protected collection, then the operation fails with permission denied
- Given I'm in production, when I try to write to any collection, then the operation succeeds (Admin SDK bypasses rules)

## Technical Requirements

### Functional Requirements

1. **Environment Detection**:
   - Use `ENVIRONMENT` to determine configuration
   - When equals to `test`: Use Admin SDK with emulator connection
   - When equals to `development` or `production`: Use Admin SDK with service account
   - When undefined: Throw error (environment must be explicitly set)

2. **Direct Admin SDK API**:

   ```typescript
   // Direct access to Firebase Admin SDK methods
   const db = getDb();
   const doc = db.doc('path/to/document');
   const collection = db.collection('path/to/collection');
   ```

3. **Configuration Management**:
   - Service account handling for production
   - Emulator configuration for testing
   - Environment variable management

### Non-functional Requirements

- **Performance**: Direct SDK usage with minimal overhead
- **Reliability**: Proper error handling and logging
- **Maintainability**: Simple, direct implementation without abstraction layers

### Dependencies

- Firebase Admin SDK (already installed)
- Environment configuration (already set up)
- Service account credentials (for production)

### Performance Criteria

- SDK initialization: < 100ms
- Operation overhead: Minimal (direct SDK usage)
- Memory usage: Standard Firebase Admin SDK usage

## API Endpoints

N/A (This is a library/utility, not an API)

## Database Changes

N/A (This is a configuration layer, no database changes required)

## UI/UX Requirements

N/A (Backend utility)

## Test Requirements

### Unit Test Scenarios

1. **Environment Detection Tests**:
   - Test configuration with `ENVIRONMENT=test`
   - Test configuration with `ENVIRONMENT=development`
   - Test error throwing when environment variable is undefined

2. **Operation Tests**:
   - Test all operations (doc, set, get, etc.) with Admin SDK
   - Test error handling for each operation
   - Test type safety and return types

3. **Integration Tests**:
   - Test with actual Firestore emulator
   - Test security rules enforcement in test environment
   - Test Admin SDK bypass in production environment

### Integration Test Cases

1. **Emulator Mode**:
   - Connect to emulator
   - Test read operations (should succeed)
   - Test write operations (should respect security rules)
   - Verify permission denied errors for protected operations

2. **Production Mode**:
   - Test all operations succeed regardless of security rules
   - Verify no permission errors occur

### E2E Test Workflows

1. **Complete Backend Function Test**:
   - Use Admin SDK in `createGameSession`
   - Test with emulator and security rules
   - Verify proper error handling and success cases

### Coverage Requirements

- 100% code coverage for configuration logic
- 100% coverage for environment detection logic
- 100% coverage for all operation methods

## Development Phases

### Phase 1: Core Admin SDK Integration

- Create `src/services/firebaseAdmin.ts` - Main Admin SDK configuration
- Implement environment detection logic
- Add service account handling for production
- Add emulator configuration for testing
- Implement basic operations (doc, set, get)

### Phase 2: Extended Operations

- Add remaining operations (collection, getDocs, addDoc, updateDoc, deleteDoc)
- Implement proper error handling
- Add TypeScript type definitions

### Phase 3: Testing and Integration

- Create comprehensive test suite for Admin SDK operations
- Test environment detection with different configurations
- Test all operations with emulator
- Test error handling and edge cases
- Test security rules enforcement in emulator mode
- Integrate with existing backend functions
- Update existing tests to use Admin SDK

### Phase 4: Documentation and Polish

- Add JSDoc comments
- Create usage examples
- Update project documentation

## Risks & Mitigations

### Technical Risks

1. **Service Account Management**:
   - **Risk**: Service account credentials not properly configured
   - **Mitigation**: Clear documentation, environment variable validation

2. **Emulator Configuration**:
   - **Risk**: Emulator not properly connected in test environment
   - **Mitigation**: Clear setup instructions, environment variable validation

3. **Environment Detection Failures**:
   - **Risk**: Wrong configuration selected in production
   - **Mitigation**: Clear logging, explicit environment requirement, comprehensive testing

### Timeline Risks

1. **Integration Complexity**:
   - **Risk**: Existing code requires significant refactoring
   - **Mitigation**: Gradual migration, clear documentation

### Mitigation Strategies

- Start with a small subset of operations
- Test thoroughly in both environments
- Maintain clear documentation and examples
- Comprehensive error handling and logging
