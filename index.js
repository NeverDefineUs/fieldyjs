function getJSON(url) {
  return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.responseType ='json'
      xhr.open('GET', url);
      xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
              resolve(xhr.response);
          } else {
              reject({
                  status: this.status,
                  statusText: xhr.statusText
              });
          }
      };
      xhr.onerror = function () {
          reject({
              status: this.status,
              statusText: xhr.statusText
          });
      };
      xhr.send();
  });
}

const base_types = ["string", "integer", "float", "boolean", "date"];

let schemas = {};

export async function loadSchema(schema_base_path, schema_name) {
  const schema_path = schema_base_path + schema_name + '.json'
  let schema = await getJSON(schema_path)
  schemas[schema_name] = schema;
  for(const field_name in schema.fields) {
    const field = schema.fields[field_name]
    let field_type = field.type
    while(field_type[0] === '[' && field_type[field_type.length - 1] === ']'){
      field_type = field_type.substr(1, field_type.length - 2);
    }
    if (!base_types.includes(field_type)) {
      await loadSchema(schema_base_path, field_type);
    }
  }
}

export function getLoadedSchemas() {return schemas;};