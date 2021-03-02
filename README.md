# Rugo MongoDB


## Usage

```js
const model = Model(db, modelName, modelSchema);

await model.create({
  // obj
});

await model.get(id);

await model.find(query);

await model.patch(id, query);

await model.remove(id);
```

## Schema

```json
{
  "name": {
    "type": "typeName",
    "trigger": "triggerValue"
  },
}
```

## Common Triggers

- `required`: boolean
- `unique`: boolean
- `index`: boolean

## Types

### Text

- `minLength`: number
- `maxLength`: number
- `regex`: string with regex syntax

### Number

- `min`: number
- `max`: number