export default {
  type: "object",
  properties: {
    memberId: { type: 'string' }
  },
  required: ['memberId']
} as const;