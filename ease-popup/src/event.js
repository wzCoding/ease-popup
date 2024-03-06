const triggerEvents = {   //触发事件选项
    'click': ['click'],
    'hover': ['mouseenter', 'mouseleave']
}

const allEvents = {
    'scroll': ['scroll']
}

function EventListener(options = {
    trigger: 'click',
    element: null,
    handler: null,
    capture: false,
    removeFlag: false
}) {
    const { trigger, element, handler, capture, removeFlag } = options
    const events = triggerEvents[trigger] ? triggerEvents[trigger] : allEvents[trigger]
    const listener = removeFlag ? 'removeEventListener' : 'addEventListener'
    for (const e of events) {
        element[listener](e, handler, capture)
    }
}
function addListener(trigger, element, handler, capture = false) {
    return EventListener({
        trigger, element, handler, capture
    })
}
function removeListener(trigger, element, handler, capture = false) {
    return EventListener({
        trigger, element, handler, capture, removeFlag: true
    })
}

export {
    triggerEvents,
    addListener,
    removeListener,
    
}