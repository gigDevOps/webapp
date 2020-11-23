export default function update(state, payload) {
    return {
        ...state,
        data: {
            ...state.data,
            ...payload
        }
    };
}
