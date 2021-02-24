import { MutationTree } from 'vuex'

export const state = () => ({
  notice: null as null | string,
  error: null as null | string
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  addNotice (state, message: string) {
    state.notice = message
  },

  addError (state, message: string) {
    state.error = message
  },

  unsetNotice (state) {
    state.notice = null
  },

  unsetError (state) {
    state.error = null
  }
}
