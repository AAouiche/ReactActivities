export interface PaginatedResult<T> {
    items: T[];            
    metadata: PaginationMetadata; 
}