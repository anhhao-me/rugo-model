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

**Validate**

- `minLength`: number
- `maxLength`: number
- `regex`: string with regex syntax

**Transform**

- `uppercase`: boolean
- `lowercase`: boolean
- `trim`: boolean

### Number

- `min`: number
- `max`: number

---

## Upcomming features

### Nested Schema

```json
{
  "fieldName": {
    "type": "List",
    "subtype": "Text"
  },
  "fieldName2": ["List", "Doc", {
    "abc": "Text",
    "def": "Text"
  }],
  "fieldName3": {
    "type": "List",
    "children": {
      "type": "Doc",
      "fields": {
        "ghi": "Text"
      }
    }
  }
}
```