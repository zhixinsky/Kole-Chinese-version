const models: SmartPlaylistModel[] = [
  {
    name: 'title',
    type: 'text',
    label: '标题',
  },
  {
    name: 'album.name',
    type: 'text',
    label: '专辑',
  },
  {
    name: 'artist.name',
    type: 'text',
    label: '艺术家',
  },
  {
    name: 'genre',
    type: 'text',
    label: '类型',
  },
  {
    name: 'year',
    type: 'number',
    label: '年份',
  },
  {
    name: 'interactions.play_count',
    type: 'number',
    label: '播放次数',
  },
  {
    name: 'interactions.last_played_at',
    type: 'date',
    label: '上次播放',
  },
  {
    name: 'length',
    type: 'number',
    label: '时长',
    unit: 'seconds',
  },
  {
    name: 'created_at',
    type: 'date',
    label: '加入日期',
  },
  {
    name: 'updated_at',
    type: 'date',
    label: '修改日期',
  },
]

export default models
