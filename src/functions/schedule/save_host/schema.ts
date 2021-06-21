export default {
  type: "object",
  properties: {
    nickName: { type: 'string' },
    image: { type: 'string' },
    memberId: { type: 'string' },
    end: { type: 'string' },
    start: { type: 'string' },
  },
  required: ['nickName', 'image', 'end', 'start', 'memberId']
} as const;