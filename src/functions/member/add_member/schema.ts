export default {
  type: "object",
  properties: {
    nickName: { type: 'string' },
    image: { type: 'string' }
  },
  required: ['nickName', 'image']
} as const;