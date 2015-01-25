var SMB = require( '../smb' )

/**
 * SMB Packet Constructor
 * @return {Packet}
 */
function Packet() {
  
  if( !(this instanceof Packet) )
    return new Packet()
  
  this.header = new Packet.Header()
  
}

/**
 * SMB Packet Header
 * @type {Function}
 */
Packet.Header = require( './header' )

/**
 * Identifies message type (req/res) and
 * message format (NOTIFY, ERROR, ...)
 * @param  {Buffer} buffer
 * @return {[type]}
 * @todo
 */
Packet.identify = function( buffer ) {
  
  var command = buffer.readUInt16LE( 12 )
  var flags = buffer.readUInt32LE( 16 )
  var isResponse = flags & SMB.PACKET.SERVER_TO_REDIR
  
  // TODO
  
}

/**
 * Parse a message buffer
 * @param  {Buffer}  buffer
 * @return {Packet}
 * @todo
 */
Packet.parse = function( buffer ) {
  
  // Identify packet / message type
  var Message = Packet.identify( buffer )
  if( Message == null ) {
    throw new Error( 'Unknown packet type' )
  }
  
  return new Message().parse( buffer )
  
}

/**
 * SMB Packet Prototype
 * @type {Object}
 */
Packet.prototype = {
  
  constructor: Packet,
  
  get isAsync()     { return !!this.getFlag( SMB.PACKET.ASYNC_COMMAND ) },
  get isResponse()  { return !!this.getFlag( SMB.PACKET.SERVER_TO_REDIR ) },
  get isRequest()   { return  !this.getFlag( SMB.PACKET.SERVER_TO_REDIR ) },
  get isCompound()  { return !!this.getFlag( SMB.PACKET.RELATED_OPERATIONS ) },
  get isSigned()    { return !!this.getFlag( SMB.PACKET.SIGNED ) },
  get isReplay()    { return !!this.getFlag( SMB.PACKET.REPLAY_OPERATION ) },
  
  getFlag: function( flag ) {
    return this.header.flags & flag
  },
  
  setFlag: function( flag ) {
    this.header.flags = this.header.flags | flag
  },
  
  parse: function( buffer ) {
    this.header.parse( buffer )
    this.parsePayload(
      buffer.slice( this.header.structureSize )
    )
  },
  
  parsePayload: function( buffer ) {
    throw new Error( 'Not implemented' )
  },
  
  serialize: function() {
    throw new Error( 'Not implemented' )
  },
  
  toBuffer: function() {
    return Buffer.concat([
      this.header.toBuffer(),
      this.serialize()
    ])
  },
  
}

// Exports
module.exports = Packet
