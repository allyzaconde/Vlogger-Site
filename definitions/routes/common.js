const UniqueIDData = {
    type: 'string',
    description: 'A unique identifier',
    value: 'd3727761-4504-4fb5-8ec5-0bb3c71d6e73',
    example: 'd3727761-4504-4fb5-8ec5-0bb3c71d6e73'
};

const JWTToken = {
    type: 'string',
    description: 'Token for authorization',
    value: '14_as8auwj_i91njaoa114_as8auwj_i91njaoa114_as8auwj_i91njaoa114_as8auwj_i91njaoa114_as8auwj_i91njaoa114_as8auwj_i91njaoa1',
    example: '14_as8auwj_i91njaoa114_as8auwj_i91njaoa114_as8auwj_i91njaoa114_as8auwj_i91njaoa114_as8auwj_i91njaoa114_as8auwj_i91njaoa1'
};

const TextData = {
    type: 'string',
    description: 'Any string',
    value: 'This is a string',
    example: 'This is a string'
};

const BooleanData = {
    type: 'boolean',
    description: 'If an item is true or false',
    value: true,
    example: false
};

const DateData = {
    type: 'number',
    description: 'A date value in Unix Epoch',
    value: 1630752518807,
    example: 1630752518807
};

const SuccessData = {
    type: 'boolean',
    description: 'State of a response',
    value: true,
    example: true
};

const SuccessResponse = {
    type: 'object',
    description: 'Response with a success state only',
    properties: {
        success: SuccessData
    }
};

const LimitData = {
    type: 'number',
    description: 'Limit of items in query',
    value: 10,
    example: 50
};

exports.common = {
    UniqueIDData,
    JWTToken,
    TextData,
    BooleanData,
    DateData,
    LimitData,
    SuccessData,
    SuccessResponse
}