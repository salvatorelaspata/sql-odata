const { sqlToEdm } = require('./edm')

const __capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const _composeProperty = (properties) => {
  let xml = ''
  const { camelCasedFields, primaryKeys } = properties
  const propertyTuple = Object.entries(camelCasedFields)
  propertyTuple.forEach(([key, value]) => {
    xml += `<Property Name="${__capitalize(key)}" Type="${sqlToEdm[value.sqlType]}" Nullable="${value.isNullable}" />`
  })

  return xml
}

const _composeKeys = (primaryKeys) => {
  let xml = ''
  xml += `<Key>`
  primaryKeys.forEach((key) => {
    xml += `<PropertyRef Name="${__capitalize(key)}" />`
  })
  xml += `</Key>`
  return xml
}

const _composeEntities = (entities) => {
  let xml = ''
  // entities is object with key as entity name and value as entity object
  const entityTuple = Object.entries(entities)
  entityTuple.forEach(([key, value]) => {
    xml += `<EntityType Name="${__capitalize(key)}">`
    xml += _composeKeys(value.primaryKeys)
    xml += _composeProperty(value)
    xml += `</EntityType>`
  })
  return xml
}

const _composeEntitiesSet = ({ ns, entities }) => {
  let xml = ''

  const entityTuple = Object.keys(entities)
  entityTuple.forEach((key) => {
    xml += `<EntitySet Name="${__capitalize(key)}" EntityType="${__capitalize(ns)}Model.${__capitalize(key)}" />`
  })
  return xml
}

// unused
const _composeAssociation = (entities) => {
  let xml = ''

  const entityTuple = Object.entries(entities)
  entityTuple.forEach(([key, value]) => {
    xml += `<Association Name="${__capitalize(key)}">`
    xml += `<End Type="${__capitalize(key)}" Multiplicity="*" Role="${__capitalize(key)}_1" />`
    xml += `<End Type="${__capitalize(key)}" Multiplicity="*" Role="${__capitalize(key)}_2" />`
    xml += `</Association>`
  })
}

const composeXml = ({ ns = 'northwind', entities }) => {
  let xml = ''
  xml += `<edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" Version="1.0">`
  xml += `<edmx:DataServices xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" m:DataServiceVersion="1.0">`
  xml += `<Schema xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://schema.microsoft.com/ado/2008/09/edm" Namespace="${__capitalize(ns)}Model">`
  xml += _composeEntities(entities)
  xml += `</Schema>`
  xml += `<Schema xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://schemas.microsoft.com/ado/2008/09/edm" Namespace="ODataWeb.${__capitalize(ns)}.Model">`
  xml += `<EntityContainer xmlns:p7="http://schemas.microsoft.com/ado/2009/02/edm/annotation" Name="${__capitalize(ns)}Entities" p7:LazyLoadingEnabled="true" m:IsDefaultEntityContainer="true">`
  xml += _composeEntitiesSet({ entities, ns })
  // xml += _composeAssociation({entities, ns})
  xml += `</EntityContainer>`
  xml += `</Schema>`
  xml += `</edmx:DataServices>`
  xml += `</edmx:Edmx>`
  return xml
}

module.exports = composeXml