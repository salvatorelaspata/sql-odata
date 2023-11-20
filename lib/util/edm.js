const EDM_TYPE = {
  // Primitive
  Binary: 'Edm.Binary',
  Boolean: 'Edm.Boolean',
  Byte: 'Edm.Byte',
  DateTime: 'Edm.DateTime',
  Decimal: 'Edm.Decimal',
  Double: 'Edm.Double',
  Single: 'Edm.Single',
  Guid: 'Edm.Guid',
  Int16: 'Edm.Int16',
  Int32: 'Edm.Int32',
  Int64: 'Edm.Int64',
  SByte: 'Edm.SByte',
  String: 'Edm.String',
  Time: 'Edm.Time',
  DateTimeOffset: 'Edm.DateTimeOffset',
  // Geography
  Geography: 'Edm.Geography',
  GeographyPoint: 'Edm.GeographyPoint',
  GeographyLineString: 'Edm.GeographyLineString',
  GeographyPolygon: 'Edm.GeographyPolygon',
  GeographyMultiPoint: 'Edm.GeographyMultiPoint',
  GeographyMultiLineString: 'Edm.GeographyMultiLineString',
  GeographyMultiPolygon: 'Edm.GeographyMultiPolygon',
  GeographyCollection: 'Edm.GeographyCollection',
  // Geometry
  Geometry: 'Edm.Geometry',
  GeometryPoint: 'Edm.GeometryPoint',
  GeometryLineString: 'Edm.GeometryLineString',
  GeometryPolygon: 'Edm.GeometryPolygon',
  GeometryMultiPoint: 'Edm.GeometryMultiPoint',
  GeometryMultiLineString: 'Edm.GeometryMultiLineString',
  GeometryMultiPolygon: 'Edm.GeometryMultiPolygon',
  GeometryCollection: 'Edm.GeometryCollection',
  // Stream
  Stream: 'Edm.Stream',
}

const sqlToEdm = {
  text: EDM_TYPE.String,
  varchar: EDM_TYPE.String,
  integer: EDM_TYPE.Int32,
  boolean: EDM_TYPE.Boolean,
  datetime: EDM_TYPE.DateTime,
}

module.exports = {
  EDM_TYPE,
  sqlToEdm,
}