interface NormalValue {
  _type: 'number' | 'string' | 'binary' | 'language' | 'fixedPoint',
  name: string,
  size: number | 'auto' | string,
  exSize? : number,
  loop?: 'inf' | string,
  mask?: number,
}

interface StructValue {
  _type: 'struct',
  name: string,
  struct: Value[],
  loop?: 'inf' | string,
} 

interface ContainerValue {
  _type: 'container',
  name: string,
  typeDict: BoxTypeDict
} 

export type Value = NormalValue | StructValue | ContainerValue;

export type BoxTypeDict = {
  [key: string]: Value
}

export const boxTypeDict: BoxTypeDict = {
  ftyp: {
    _type: 'struct',
    name: 'ftyp',
    struct: [
      {
        _type: 'string',
        name: 'major_brand',
        size: 4,
      },
      {
        _type: 'number',
        name: 'minor_version',
        size: 4,
      },
      {
        _type: 'string',
        name: 'compatible_brands',
        size: 4,
        loop: 'inf'
      }
    ]
  },
  moov: {
    _type: 'container',
    name: 'moov',
    typeDict: {
      mvhd: {
        _type: 'struct',
        name: 'mvhd',
        struct: [
          {
            _type: 'number',
            name: 'version',
            size: 1,
          },
          {
            _type: 'number',
            name: 'flags',
            size: 3,
          },
          {
            _type: 'number',
            name: 'creation_time',
            size: 4,
          },
          {
            _type: 'number',
            name: 'modification_time',
            size: 4,
          },
          {
            _type: 'number',
            name: 'timescale',
            size: 4,
          },
          {
            _type: 'number',
            name: 'duration',
            size: 4,
          },
          {
            _type: 'number',
            name: 'rate',
            size: 4,
          },
          {
            _type: 'number',
            name: 'volume',
            size: 2,
          },
          {
            _type: 'binary',
            name: 'reserved',
            size: 10,
          },
          {
            _type: 'binary',
            name: 'matrix',
            size: 36,
          },
          {
            _type: 'binary',
            name: 'pre_defined',
            size: 24,
          },
          {
            _type: 'number',
            name: 'next_track_ID',
            size: 4,
          },
        ]
      },
      trak: {
        _type: 'container',
        name: 'trak',
        typeDict: {
          tkhd: {
            _type: 'struct',
            name: 'tkhd',
            struct: [
              {
                _type: 'number',
                name: 'version',
                size: 1,
              },
              {
                _type: 'number',
                name: 'flags',
                size: 3,
              },
              {
                _type: 'number',
                name: 'creation_time',
                size: 4,
              },
              {
                _type: 'number',
                name: 'modification_time',
                size: 4,
              },
              {
                _type: 'number',
                name: 'track_ID',
                size: 4,
              },
              {
                _type: 'binary',
                name: 'reserved',
                size: 4,
              },
              {
                _type: 'number',
                name: 'duration',
                size: 4,
              },
              {
                _type: 'binary',
                name: 'reserved2',
                size: 8,
              },
              {
                _type: 'number',
                name: 'layer',
                size: 2,
              },
              {
                _type: 'number',
                name: 'alternate_group',
                size: 2,
              },
              {
                _type: 'number',
                name: 'volume',
                size: 2,
              },
              {
                _type: 'binary',
                name: 'reserved3',
                size: 2,
              },
              {
                _type: 'binary',
                name: 'matrix',
                size: 36,
              },
              {
                _type: 'number',
                name: 'width',
                size: 4,
              },
              {
                _type: 'number',
                name: 'height',
                size: 4,
              },
            ]
          },
          edts: {
            _type: 'container',
            name: 'edts',
            typeDict: {
              elst: {
                _type: 'struct',
                name: 'elst',
                struct: [
                  {
                    _type: 'number',
                    name: 'version',
                    size: 1,
                  },
                  {
                    _type: 'number',
                    name: 'flags',
                    size: 3,
                  },
                  {
                    _type: 'number',
                    name: 'entry_count',
                    size: 4,
                  },
                  {
                    _type: 'struct',
                    name: 'entry',
                    loop: 'entry_count',
                    struct: [
                      {
                        _type: 'number',
                        name: 'segment_duration',
                        size: 4,
                        exSize: 8,
                      },
                      {
                        _type: 'number',
                        name: 'media_time',
                        size: 4,
                        exSize: 8,
                      },
                      {
                        _type: 'number',
                        name: 'media_rate_integer',
                        size: 2,
                      },
                      {
                        _type: 'number',
                        name: 'media_rate_fraction',
                        size: 2,
                      },
                    ]
                  }
                ]
              }
            }
          },
          mdia: {
            _type: 'container',
            name: 'mdia',
            typeDict: {
              mdhd: {
                _type: 'struct',
                name: 'mdhd',
                struct: [
                  {
                    _type: 'number',
                    name: 'version',
                    size: 1,
                  },
                  {
                    _type: 'number',
                    name: 'flags',
                    size: 3,
                  },
                  {
                    _type: 'number',
                    name: 'creation_time',
                    size: 4,
                    exSize: 8,
                  },
                  {
                    _type: 'number',
                    name: 'modification_time',
                    size: 4,
                    exSize: 8,
                  },
                  {
                    _type: 'number',
                    name: 'timescale',
                    size: 4,
                  },
                  {
                    _type: 'number',
                    name: 'duration',
                    size: 4,
                    exSize: 8,
                  },
                  {
                    _type: 'language',
                    name: 'language',
                    size: 2,
                  },
                  {
                    _type: 'binary',
                    name: 'pre_defined',
                    size: 2,
                  },
                ]
              },
              hdlr: {
                _type: 'struct',
                name: 'hdlr',
                struct: [
                  {
                    _type: 'number',
                    name: 'version',
                    size: 1,
                  },
                  {
                    _type: 'number',
                    name: 'flags',
                    size: 3,
                  },
                  {
                    _type: 'binary',
                    name: 'component_type', // all zeros
                    size: 4,
                  },
                  {
                    _type: 'string',
                    name: 'component_subtype',
                    size: 4,
                  },
                  {
                    _type: 'binary',
                    name: 'component_manufacturer', // all zeros
                    size: 4,
                  },
                  {
                    _type: 'number',
                    name: 'component_flags', // all zeros
                    size: 4,
                  },
                  {
                    _type: 'number',
                    name: 'component_flags_mask', // all zeros
                    size: 4,
                  },
                  {
                    _type: 'string',
                    name: 'component_name',
                    size: 'auto',
                  },
                ]
              },
              minf: {
                _type: 'container',
                name: 'minf',
                typeDict: {
                  vmhd: {
                    _type: 'struct',
                    name: 'vmhd',
                    struct: [
                      {
                        _type: 'number',
                        name: 'version',
                        size: 1,
                      },
                      {
                        _type: 'number',
                        name: 'flags', // default 1
                        size: 3,
                      },
                      {
                        _type: 'number',
                        name: 'graphicsmode',
                        size: 2,
                      },
                      {
                        _type: 'binary',
                        name: 'opcolor',
                        size: 6,
                      },
                    ]
                  },
                  smhd: {
                    _type: 'struct',
                    name: 'smhd',
                    struct: [
                      {
                        _type: 'number',
                        name: 'version',
                        size: 1,
                      },
                      {
                        _type: 'number',
                        name: 'flags', // default 0
                        size: 3,
                      },
                      {
                        _type: 'fixedPoint',
                        name: 'balance',
                        size: 2,
                      },
                      {
                        _type: 'binary',
                        name: 'reserved',
                        size: 2,
                      },
                    ]
                  },
                  dinf: {
                    _type: 'container',
                    name: 'dinf',
                    typeDict: {
                      dref: {
                        _type: 'struct',
                        name: 'dref',
                        struct: [
                          {
                            _type: 'number',
                            name: 'version',
                            size: 1,
                          },
                          {
                            _type: 'number',
                            name: 'flags',
                            size: 3,
                          },
                          {
                            _type: 'number',
                            name: 'entry_count',
                            size: 4,
                          },
                          {
                            _type: 'container',
                            name: 'entry',
                            typeDict: {
                              "url ": { // space is needed
                                _type: 'struct',
                                name: 'url ',
                                struct: [
                                  {
                                    _type: 'number',
                                    name: 'version',
                                    size: 1,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'flags',
                                    size: 3,
                                  },
                                  {
                                    _type: 'string',
                                    name: 'location',
                                    size: 'auto',
                                  },
                                ]
                              },
                              alis: {
                                _type: 'struct',
                                name: 'alis',
                                struct: [
                                  {
                                    _type: 'number',
                                    name: 'version',
                                    size: 1,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'flags',
                                    size: 3,
                                  },
                                  {
                                    _type: 'string',
                                    name: 'alias',
                                    size: 'auto',
                                  },
                                ]
                              },
                              rsrc: {
                                _type: 'struct',
                                name: 'rsrc',
                                struct: [
                                  {
                                    _type: 'number',
                                    name: 'version',
                                    size: 1,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'flags',
                                    size: 3,
                                  },
                                  {
                                    _type: 'binary',
                                    name: 'data',
                                    size: 'auto',
                                  },
                                ]
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                  stbl: {
                    _type: 'container',
                    name: 'stbl',
                    typeDict: {
                      stsd: {
                        _type: 'struct',
                        name: 'stsd',
                        struct: [
                          {
                            _type: 'number',
                            name: 'version',
                            size: 1,
                          },
                          {
                            _type: 'number',
                            name: 'flags',
                            size: 3,
                          },
                          {
                            _type: 'number',
                            name: 'entry_count',
                            size: 4,
                          },
                          {
                            _type: 'container',
                            name: 'entry',
                            typeDict: {
                              avc1: {
                                _type: 'struct',
                                name: 'avc1',
                                struct: [
                                  {
                                    _type: 'number',
                                    name: 'reserved',
                                    size: 6,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'data_reference_index',
                                    size: 2,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'pre_defined', // 0x0000
                                    size: 2,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'reserved',
                                    size: 2,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'pre_defined', // 0x0000 0000 0000 0000 0000 0000
                                    size: 12,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'width',
                                    size: 2,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'height',
                                    size: 2,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'horizresolution',
                                    size: 4,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'vertresolution',
                                    size: 4,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'reserved',
                                    size: 4,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'frame_count',
                                    size: 2,
                                  },
                                  {
                                    _type: 'string',
                                    name: 'compressor_name',
                                    size: 32,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'depth',
                                    size: 2,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'pre_defined', // 0xffff
                                    size: 2,
                                  },
                                  {
                                    _type: 'container',
                                    name: 'avcC',
                                    typeDict: {
                                      avcC: {
                                        _type: 'struct',
                                        name: 'avcC',
                                        struct: [
                                          {
                                            _type: 'number',
                                            name: 'configuration_version',
                                            size: 1,
                                          },
                                          {
                                            _type: 'number',
                                            name: 'AVC_profile_indication',
                                            size: 1,
                                          },
                                          {
                                            _type: 'number',
                                            name: 'profile_compatibility',
                                            size: 1,
                                          },
                                          {
                                            _type: 'number',
                                            name: 'AVC_level_indication',
                                            size: 1,

                                          },
                                          {
                                            _type: 'number',
                                            name: 'length_size_minus_one', //TODO: 
                                            size: 1,
                                          },
                                          {
                                            _type: 'number',
                                            name: 'num_of_sequence_parameter_sets',
                                            size: 1,
                                            mask: 0x1f,
                                          },
                                          {
                                            _type: 'struct',
                                            name: 'sequence_parameter_set',
                                            struct: [
                                              {
                                                _type: 'number',
                                                name: 'sequence_parameter_set_length',
                                                size: 2,
                                              },
                                              {
                                                _type: 'binary',
                                                name: 'sequence_parameter_set_nal_unit',
                                                size: 'sequence_parameter_set_length',
                                              },
                                            ],
                                            loop: 'num_of_sequence_parameter_sets',
                                          },
                                          {
                                            _type: 'number',
                                            name: 'num_of_picture_parameter_sets',
                                            size: 1,
                                          },
                                          {
                                            _type: 'struct',
                                            name: 'picture_parameter_set',
                                            struct: [
                                              {
                                                _type: 'number',
                                                name: 'picture_parameter_set_length',
                                                size: 2,

                                              },
                                              {
                                                _type: 'binary',
                                                name: 'picture_parameter_set_nal_unit',
                                                size: 'picture_parameter_set_length',
                                              },
                                            ],
                                            loop: 'num_of_picture_parameter_sets',
                                          },
                                        ],
                                      },
                                      pasp: {
                                        _type: 'struct',
                                        name: 'pasp',
                                        struct: [
                                          {
                                            _type: 'number',
                                            name: 'hSpacing',
                                            size: 4,
                                          },
                                          {
                                            _type: 'number',
                                            name: 'vSpacing',
                                            size: 4,
                                          },
                                        ],
                                      },
                                      btrt: {
                                        _type: 'struct',
                                        name: 'btrt',
                                        struct: [
                                          {
                                            _type: 'number',
                                            name: 'buffer_size_db',
                                            size: 4,
                                          },
                                          {
                                            _type: 'number',
                                            name: 'max_bitrate',
                                            size: 4,
                                          },
                                          {
                                            _type: 'number',
                                            name: 'avg_bitrate',
                                            size: 4,
                                          },
                                        ],
                                      },
                                        
                                    },
                                  },
                                ],
                              },
                              mp4a: {
                                _type: 'struct',
                                name: 'mp4a',
                                struct: [
                                  {
                                    _type: 'binary',
                                    name: 'reserved', // 0x0000 0000 0000
                                    size: 6,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'data_reference_index',
                                    size: 2,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'encoder_version', // 0x0000
                                    size: 2,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'encoder_revision_level', // 0x0000
                                    size: 2,
                                  },
                                  {
                                    _type: 'binary',
                                    name: 'encoder_vendor', // 0x0000 0000
                                    size: 4,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'channel_count',
                                    size: 2,
                                  },
                                  {
                                    _type: 'number',
                                    name: 'sample_size',
                                    size: 2,
                                  },
                                  {
                                    _type: 'binary',
                                    name: 'pre_defined', // 0x0000 
                                    size: 2,
                                  },
                                  {
                                    _type: 'binary',
                                    name: 'pre_defined', // 0x0000
                                    size: 2,
                                  },
                                  {
                                    _type: 'fixedPoint',
                                    name: 'sample_rate',
                                    size: 4,
                                  },
                                  {
                                    _type: 'container',
                                    name: 'esds',
                                    typeDict: {
                                      esds: {
                                        _type: 'struct',
                                        name: 'esds',
                                        struct: [
                                          {
                                            _type: 'number',
                                            name: 'version',
                                            size: 1,
                                          },
                                          {
                                            _type: 'number',
                                            name: 'flags',
                                            size: 3,
                                          },
                                          {
                                            _type: 'binary',
                                            name: 'ES_Descriptor',
                                            size: 'auto'
                                          }
                                        ],
                                      },
                                      btrt: {
                                        _type: 'struct',
                                        name: 'btrt',
                                        struct: [
                                          {
                                            _type: 'number',
                                            name: 'buffer_size_db',
                                            size: 4,
                                          },
                                          {
                                            _type: 'number',
                                            name: 'max_bitrate',
                                            size: 4,
                                          },
                                          {
                                            _type: 'number',
                                            name: 'avg_bitrate',
                                            size: 4,
                                          },
                                        ],
                                      }
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                      stts: {
                        _type: 'struct',
                        name: 'stts',
                        struct: [
                          {
                            _type: 'number',
                            name: 'version',
                            size: 1,
                          },
                          {
                            _type: 'number',
                            name: 'flags',
                            size: 3,
                          },
                          {
                            _type: 'number',

                            name: 'entry_count',
                            size: 4,
                          },
                          {
                            _type: 'struct',
                            name: 'entry',
                            struct: [
                              {
                                _type: 'number',
                                name: 'sample_count',
                                size: 4,
                              },
                              {
                                _type: 'number',
                                name: 'sample_delta',
                                size: 4,
                              },
                            ],
                            loop: 'entry_count',
                          }
                        ],

                      },
                      ctts: {
                        _type: 'struct',
                        name: 'ctts',
                        struct: [
                          {
                            _type: 'number',
                            name: 'version',
                            size: 1,
                          },
                          {
                            _type: 'number',
                            name: 'flags',
                            size: 3,
                          },
                          {
                            _type: 'number',
                            name: 'entry_count',
                            size: 4,
                          },
                          {
                            _type: 'struct',
                            name: 'entry',
                            struct: [
                              {
                                _type: 'number',
                                name: 'sample_count',
                                size: 4,
                              },
                              {
                                _type: 'number',
                                name: 'sample_offset',
                                size: 4,
                              },
                            ],
                            loop: 'entry_count',
                          },
                        ],
                      },
                      stss: {
                        _type: 'struct',
                        name: 'stss',
                        struct: [
                          {
                            _type: 'number',
                            name: 'version',
                            size: 1,
                          },
                          {
                            _type: 'number',
                            name: 'flags',
                            size: 3,
                          },
                          {
                            _type: 'number',
                            name: 'entry_count',
                            size: 4,
                          },
                          {
                            _type: 'number',
                            name: 'sample_number',
                            size: 4,
                            loop: 'entry_count',
                          },
                        ],
                      },
                      sdtp: {
                        _type: 'struct',
                        name: 'sdtp',
                        struct: [
                          {
                            _type: 'number',
                            name: 'version',
                            size: 1,
                          },
                          {
                            _type: 'number',
                            name: 'flags',
                            size: 3,
                          },
                          {
                            _type: 'struct',
                            name: 'sample_dependency_table',
                            struct: [
                              {
                                _type: 'number',
                                name: 'is_leading',
                                size: 2,
                              },
                              {
                                _type: 'number',
                                name: 'sample_depends_on',
                                size: 2,
                              },
                              {
                                _type: 'number',
                                name: 'sample_is_depended_on',
                                size: 2,
                              },
                              {
                                _type: 'number',
                                name: 'sample_has_redundancy',
                                size: 2,
                              },
                            ],
                            loop: 'inf',
                          },
                        ],
                      },
                      stsc: {
                        _type: 'struct',
                        name: 'stsc',
                        struct: [
                          {
                            _type: 'number',
                            name: 'version',
                            size: 1,
                          },
                          {
                            _type: 'number',
                            name: 'flags',
                            size: 3,
                          },
                          {
                            _type: 'number',
                            name: 'entry_count',
                            size: 4,
                          },
                          {
                            _type: 'struct',
                            name: 'entry',
                            struct: [
                              {
                                _type: 'number',
                                name: 'first_chunk',
                                size: 4,
                              },
                              {
                                _type: 'number',
                                name: 'samples_per_chunk',
                                size: 4,
                              },
                              {
                                _type: 'number',
                                name: 'sample_description_index',
                                size: 4,
                              },
                            ],
                            loop: 'entry_count',
                          },
                        ],
                      },
                      stsz: {
                        _type: 'struct',
                        name: 'stsz',
                        struct: [
                          {
                            _type: 'number',
                            name: 'version',
                            size: 1,
                          },
                          {
                            _type: 'number',
                            name: 'flags',
                            size: 3,
                          },
                          {
                            _type: 'number',
                            name: 'sample_size',
                            size: 4,
                          },
                          {
                            _type: 'number',
                            name: 'sample_count',
                            size: 4,
                          },
                          {
                            _type: 'number',
                            name: 'entry_size',
                            size: 4,
                            loop: 'sample_count',
                          },
                        ],
                      },
                      stco: {
                        _type: 'struct',
                        name: 'stco',
                        struct: [
                          {
                            _type: 'number',
                            name: 'version',
                            size: 1,
                          },
                          {
                            _type: 'number',
                            name: 'flags',
                            size: 3,
                          },
                          {
                            _type: 'number',
                            name: 'entry_count',
                            size: 4,
                          },
                          {
                            _type: 'number',
                            name: 'chunk_offset',
                            size: 4,
                            loop: 'entry_count',
                          },
                        ],
                      },
                      sgpd: {
                        _type: 'struct',
                        name: 'sgpd',
                        struct: [
                          {
                            _type: 'number',
                            name: 'version',
                            size: 1,
                          },
                          {
                            _type: 'number',
                            name: 'flags',
                            size: 3,
                          },
                          {
                            _type: 'number',
                            name: 'grouping_type',
                            size: 4,
                          },
                          {
                            _type: 'number',
                            name: 'default_length',
                            size: 4,
                          },
                          {
                            _type: 'number',
                            name: 'entry_count',
                            size: 4,
                          },
                          {
                            _type: 'binary',
                            name: 'entry',
                            size: 'default_length',
                            loop: 'entry_count',
                          },
                        ],
                      },
                      sbgp: {
                        _type: 'struct',
                        name: 'sbgp',
                        struct: [
                          {
                            _type: 'number',
                            name: 'version',
                            size: 1,
                          },
                          {
                            _type: 'number',
                            name: 'flags',
                            size: 3,
                          },
                          {
                            _type: 'number',
                            name: 'grouping_type',
                            size: 4,
                          },
                          {
                            _type: 'number',
                            name: 'entry_count',
                            size: 4,
                          },
                          {
                            _type: 'struct',
                            name: 'entry',
                            struct: [
                              {
                                _type: 'number',
                                name: 'sample_count',
                                size: 4,
                              },
                              {
                                _type: 'number',
                                name: 'group_description_index',
                                size: 4,
                              },
                            ],
                            loop: 'entry_count',
                          },
                        ],

                      }
                    }
                  }
                },
              }
            }
          }
        }
      },
    }
  },
  free: {
    _type: 'struct',
    name: 'free',
    struct: [
    ]
  }
};


