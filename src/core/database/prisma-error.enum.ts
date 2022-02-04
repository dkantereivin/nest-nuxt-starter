export enum PrismaError {
    /**
     * The provided value for the column is too long for the column's type. Column: `{column_name}`
     */
    ValueTooLongForColumnType = 'P2000',

    /**
     * The record searched for in the where condition (`{model_name}.{argument_name} = {argument_value}`) does not exist
     */
    RecordDoesNotExist = 'P2001',

    /**
     * Unique constraint failed on the `{constraint}`
     */
    UniqueConstraintViolation = 'P2002',

    /**
     * Foreign key constraint failed on the field: `{field_name}`
     */
    ForeignConstraintViolation = 'P2003',

    /**
     * A constraint failed on the database: `{database_error}`
     */
    ContraintViolation = 'P2004',

    /**
     * The value `{field_value}` stored in the database for the field `{field_name}` is invalid for the field's type
     */
    InvalidValueForFieldType = 'P2005',

    /**
     * The provided value `{field_value}` for `{model_name}` field `{field_name}` is not valid
     */
    InvalidValue = 'P2006',

    /**
     * Data validation error `{database_error}`
     */
    ValidationError = 'P2007',

    /**
     * Failed to parse the query `{query_parsing_error}` at `{query_position}`
     */
    QueryParsingError = 'P2008',

    /**
     * Failed to validate the query: `{query_validation_error}` at `{query_position}`
     */
    QueryValidationError = 'P2009',

    /**
     * Raw query failed. Code: `{code}`. Message: `{message}`
     */
    RawQueryError = 'P2010',

    /**
     * Null constraint violation on the `{constraint}`
     */
    NullConstraintViolation = 'P2011',

    /**
     * Missing a required value at `{path}`
     */
    MissingRequiredValue = 'P2012',

    /**
     * Missing the required argument `{argument_name}` for field `{field_name}` on `{object_name}`.
     */
    MissingRequiredArgument = 'P2013',

    /**
     * The change you are trying to make would violate the required relation '{relation_name}' between the `{model_a_name}` and `{model_b_name}` models.
     */
    RequiredRelationViolation = 'P2014',

    /**
     * A related record could not be found. `{details}`
     */
    RelatedRecordNotFound = 'P2015',

    /**
     * Query interpretation error. `{details}`
     */
    InterpretationError = 'P2016',

    /**
     * The records for relation `{relation_name}` between the `{parent_name}` and `{child_name}` models are not connected.
     */
    RecordsForParentAndChildNotConnected = 'P2017',

    /**
     * The required connected records were not found. `{details}`
     */
    RequiredConnnectedRecordsNotFound = 'P2018',

    /**
     * Input error. `{details}`
     */
    InputError = 'P2019',

    /**
     * Value out of range for the type. `{details}`
     */
    ValueOutOfRange = 'P2020',

    /**
     * The table `{table}` does not exist in the current database.
     */
    TableDoesNotExist = 'P2021',

    /**
     * The column `{column}` does not exist in the current database.
     */
    ColumnDoesNotExist = 'P2022',

    /**
     * Inconsistent column data: `{message}`
     */
    InconsistentColumnData = 'P2023',

    /**
     * Timed out fetching a new connection from the pool. Please consider reducing the number of requests or increasing the `connection_limit` parameter (https://www.prisma.io/docs/concepts/components/prisma-client/connection-management#connection-pool). Current limit: `{connection_limit}`.
     */
    TimedOutFetchingConnectionFromThePool = 'P2024',

    /**
     * An operation failed because it depends on one or more records that were required but not found. `{cause}`
     */
    RecordsNotFound = 'P2025',

    /**
     * The current database provider doesn't support a feature that the query used: `{feature}`
     */
    UnsupportedProviderFeature = 'P2026',

    /**
     * Multiple errors occurred on the database during query execution: `{errors}`
     */
    MultipleErrors = 'P2027'
}
