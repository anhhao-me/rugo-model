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

- `required`: `true` or `false`

## Types

### Text

- `minLength`: number
- `maxLength`: number

### Number

- `min`: number
- `max`: number