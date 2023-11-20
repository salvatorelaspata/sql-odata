const { sqlToEdm } = require('./edm')
const { capitalize } = require('./string')

const _composeProperty = (properties) => {
  let xml = ''
  const { camelCasedFields, primaryKeys } = properties
  const propertyTuple = Object.entries(camelCasedFields)
  propertyTuple.forEach(([key, value]) => {
    xml += `<Property Name="${capitalize(key)}" Type="${sqlToEdm[value.sqlType]}" Nullable="${value.isNullable}" />`
  })

  return xml
}

const _composeNavigationProperty = (value, ns) => {
  let xml = ''
  const { reverseRelationships } = value
  reverseRelationships.forEach((relationship) => {
    xml += `<NavigationProperty Name="${capitalize(relationship.relation.table_name)}" Relationship="${capitalize(ns)}Model.FK_${capitalize(relationship.relation.table_name)}" FromRole="${capitalize(relationship.relation.foreign_table_name)}" ToRole="${capitalize(relationship.relation.table_name)}" />`
  })
  return xml
}

const _composeAssociations = (value, ns) => {
  let xml = ''
  const { reverseRelationships } = value
  reverseRelationships.forEach((relationship) => {
    xml += `<Association Name="FK_${capitalize(relationship.relation.table_name)}_${capitalize(relationship.relation.foreign_table_name)}">`
    xml += `<End Role="${capitalize(relationship.relation.foreign_table_name)}" Type="${capitalize(ns)}Model.${capitalize(relationship.relation.table_name)}" Multiplicity="0..1"  />`
    xml += `<End Role="${capitalize(relationship.relation.table_name)}" Type="${capitalize(ns)}Model.${capitalize(relationship.relation.foreign_table_name)}" Multiplicity="*" />`
    // TODO add ReferentialConstraint
    xml += `</Association>`
  })
  return xml
}


const _composeAssociationsSet = (value, ns) => {
  let xml = ''
  const { reverseRelationships } = value
  reverseRelationships.forEach((relationship) => {
    xml += `<AssociationSet Name="FK_${capitalize(relationship.relation.table_name)}_${capitalize(relationship.relation.foreign_table_name)}" Association="FK_${capitalize(relationship.relation.table_name)}_${capitalize(relationship.relation.foreign_table_name)}">`
    xml += `<End Role="${capitalize(relationship.relation.foreign_table_name)}" Type="${capitalize(ns)}Model.${capitalize(relationship.relation.table_name)}" />`
    xml += `<End Role="${capitalize(relationship.relation.table_name)}" Type="${capitalize(ns)}Model.${capitalize(relationship.relation.foreign_table_name)}" />`
    // TODO add ReferentialConstraint
    xml += `</AssociationSet>`
  })
  return xml
}

const _composeKeys = (primaryKeys) => {
  let xml = ''
  xml += `<Key>`
  primaryKeys.forEach((key) => {
    xml += `<PropertyRef Name="${capitalize(key)}" />`
  })
  xml += `</Key>`
  return xml
}

const _composeEntities = ({ entities, ns }) => {
  let xml = ''
  // entities is object with key as entity name and value as entity object
  const entityTuple = Object.entries(entities)
  entityTuple.forEach(([key, value]) => {
    xml += `<EntityType Name="${capitalize(key)}">`
    xml += _composeKeys(value.primaryKeys)
    xml += _composeProperty(value)
    if (value.reverseRelationships && value.reverseRelationships.length > 0)
      xml += _composeNavigationProperty(value, ns)
    xml += `</EntityType>`
  })
  // Associations
  entityTuple.forEach(([key, value]) => {
    if (value.reverseRelationships && value.reverseRelationships.length > 0)
      xml += _composeAssociations(value, ns)
  })
  return xml
}

const _composeEntitySet = ({ entities, ns }) => {
  let xml = ''

  const entityTuple = Object.keys(entities)
  entityTuple.forEach((key, value) => {
    xml += `<EntitySet Name="${capitalize(key)}" EntityType="${capitalize(ns)}Model.${capitalize(key)}" />`
  })
  entityTuple.forEach((key, value) => {
    if (value.reverseRelationships && value.reverseRelationships.length > 0)
      xml += _composeAssociationsSet(value, ns)
  })

  return xml
}


const composeXml = ({ ns = 'northwind', entities }) => {
  let xml = ''
  xml += `<edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" Version="1.0">`
  xml += `<edmx:DataServices xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" m:DataServiceVersion="1.0">`
  xml += `<Schema xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://schema.microsoft.com/ado/2008/09/edm" Namespace="${capitalize(ns)}Model">`
  xml += _composeEntities({ entities, ns })
  xml += `</Schema>`
  // Set
  xml += `<Schema xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://schemas.microsoft.com/ado/2008/09/edm" Namespace="ODataWeb.${capitalize(ns)}.Model">`
  xml += `<EntityContainer xmlns:p7="http://schemas.microsoft.com/ado/2009/02/edm/annotation" Name="${capitalize(ns)}Entities" p7:LazyLoadingEnabled="true" m:IsDefaultEntityContainer="true">`
  xml += _composeEntitySet({ entities, ns })
  xml += `</EntityContainer>`
  xml += `</Schema>`
  xml += `</edmx:DataServices>`
  xml += `</edmx:Edmx>`
  return xml
}

module.exports = composeXml