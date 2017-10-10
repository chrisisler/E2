/**
 * Note: Modifies DOM outside of Preact.
 *
 * @param {Object} store
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object|Undefined} - The new app state. Updates the `actionsMenuNode` property.
 */
export default function closeActionsMenu(store) {
    const ref = store.getState().actionsMenuNode

    if (ref) {
        const domNode = document.getElementById(ref.id)

        if (domNode) {
            domNode.remove()
            return { actionsMenuNode: null }
        }
    }
}
