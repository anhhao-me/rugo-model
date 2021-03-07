# Rugo MongoDB

- [Usage](#usage)
- [Schema](#schema)
  - [Common configuration](#common-configuration)
  - [Scalar types](#scalar-types)
    - [checkbox](#checkbox)
    - [datetime](#datetime)
    - [email](#email)
    - [number](#number)
    - [password](#password)
    - [text](#text)
  - [Complex types](#complex-types)
    - [document](#document)
    - [list](#list)

## Usage

```js
const model = Model(db, modelName, modelSchema);

await model.create({
  // obj
});

await model.get(id);

await model.find(query);

await model.patch(id, {
  // obj key and value to update
});

await model.remove(id);
```

## Schema 

```json
{
  "<fieldName>": {
    "type": "<typeName>",
    "<optionName>": <optionValue>
  }
}
```

### Common configuration

All types accept a common set of configuration options.

Options:

- Only top level of schema:
  - `index`: If `true` a database level index will be applied to this field, which can make searching faster.
  - `unique`: If `true` then all values of this field must be unique.
  - `default`: Define the default value when this field be set to `null`.
- All position:
  - `required`: If `true` then this field can never be set to `null`.

### Scalar types

#### checkbox

A `checkbox` field represents a boolean (`true`/`false`) value.

#### datetime

A `datetime` field represents a time value.

#### email

A `email` field represents a email value. Inherit [`text`](#text) type.

#### number

A `number` field represents a number value.

Options:

- `min`: The min value of this field.
- `max`: The max value of this field.

#### password

A `number` field represents an encrypted password value. The input value will be hashed to the next operation.

#### text

A `text` field represents a string value.

Options:

- `minLength`: The min number of text characters.
- `maxLength`:The max number of text characters.
- `regex`: The regular expression to validate input data.
- `trim`: If `true`, the string is trimed.
- `lowercase`: If `true`, the string is transformed to lowercase.
- `uppercase`: If `true`, the string is transformed to uppercase.

### Complex types

#### document

A `document` field represents a object (not array) value.

#### list

A `list` field represents a array value.

Options:

- `children`: A `schema` for each item in list.

Example:

```json
{
  "pets": {
    "type": "list",
    "children": {
      "type": "text",
      "lowercase": true
    }
  }
}
```