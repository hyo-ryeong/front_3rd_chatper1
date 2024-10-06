// renderElement.js
import { addEvent, removeEvent, setupEventListeners } from './eventManager'
import { createElement__v2 } from './createElement__v2'

// TODO: processVNode 함수 구현
function processVNode(vNode) {
  // vNode를 처리하여 렌더링 가능한 형태로 변환합니다.
  // - null, undefined, boolean 값 처리
  if (!vNode || typeof vNode === 'boolean') {
    return document.createTextNode('')
  }
  // - 문자열과 숫자를 문자열로 변환
  if (typeof vNode === 'string' || typeof vNode === 'number') {
    return String(vNode)
  }
  // - 함수형 컴포넌트 처리 <---- 이게 제일 중요합니다.

  if (typeof vNode.type === 'function') {
    return processVNode(vNode.type({ ...vNode.props, children: vNode.children }))
  }
  // - 자식 요소들에 대해 재귀적으로 processVNode 호출
  return {
    ...vNode,
    children: vNode.children.map(processVNode).filter(Boolean),
  }
}

// TODO: updateAttributes 함수 구현
function updateAttributes(element, newProps = {}, oldProps = {}) {
  // DOM 요소의 속성을 업데이트합니다.
  // - 이벤트 리스너, className, style 등 특별한 경우 처리
  //   <이벤트 리스너 처리>
  //     - TODO: 'on'으로 시작하는 속성을 이벤트 리스너로 처리
  //     - 주의: 직접 addEventListener를 사용하지 않고, eventManager의 addEvent와 removeEvent 함수를 사용하세요.
  //     - 이는 이벤트 위임을 통해 효율적으로 이벤트를 관리하기 위함입니다.

  // - 이전 props에서 제거된 속성 처리

  Object.keys(oldProps).forEach((attribute) => {
    if (!(attribute in newProps)) {
      if (attribute.startsWith('on')) return removeEvent(element, attribute.slice(2).toLowerCase(), value)
      if (attribute === 'className') return element.removeAttribute('class')
      if (attribute === 'style') return (element.style.cssText = '')
      return element.removeAttribute(attribute)
    }
  })

  // - 새로운 props의 속성 추가 또는 업데이트
  Object.keys(newProps).forEach((attribute) => {
    const newValue = newProps[attribute]
    const oldValue = oldProps[attribute]
    if (newValue === oldValue) return

    if (attribute.startsWith('on') && typeof newValue === 'function') {
      const eventType = attribute.slice(2).toLowerCase()
      if (typeof oldValue === 'function') {
        removeEvent(element, eventType, oldValue)
      }
      addEvent(element, eventType, newValue)
    } else if (attribute === 'className') {
      element.className = newValue || ''
    } else if (attribute === 'style' && typeof newValue === 'object') {
      updateStyles(element, newValue, oldValue)
    } else {
      if (newValue == null || newValue === false) {
        element.removeAttribute(attribute)
      } else {
        element.setAttribute(attribute, newValue)
      }
    }
  })
}

// TODO: updateElement 함수 구현
function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentNode = parentElement.childNodes[index]

  // 1. 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  // TODO: oldNode만 존재하는 경우, 해당 노드를 DOM에서 제거

  if (!newNode && oldNode) {
    return currentNode && parentElement.removeChild(currentNode)
  }
  // 2. 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  // TODO: newNode만 존재하는 경우, 새 노드를 생성하여 DOM에 추가

  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement__v2(newNode))
  }

  // 3. 텍스트 노드 업데이트
  // TODO: newNode와 oldNode가 둘 다 문자열 또는 숫자인 경우
  // TODO: 내용이 다르면 텍스트 노드 업데이트

  if (typeof newNode === 'string' || typeof newNode === 'number') {
    if (newNode !== oldNode && currentNode) {
      const newTextNode = document.createTextNode(String(newNode))
      parentElement.replaceChild(newTextNode, currentNode)
    }
    return
  }

  // 4. 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  // TODO: 타입이 다른 경우, 이전 노드를 제거하고 새 노드로 교체

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement__v2(newNode), currentNode)
    return
  }

  // 5. 같은 타입의 노드 업데이트
  // 5-1. 속성 업데이트
  // TODO: updateAttributes 함수를 호출하여 속성 업데이트
  updateAttributes(currentNode, newNode.props || {}, oldNode.props || {})

  // 5-2. 자식 노드 재귀적 업데이트
  // TODO: newNode와 oldNode의 자식 노드들을 비교하며 재귀적으로 updateElement 호출
  // HINT: 최대 자식 수를 기준으로 루프를 돌며 업데이트
  const newChildren = newNode.children || []
  const oldChildren = oldNode.children || []
  const maxLength = Math.max(newChildren.length, oldChildren.length)

  for (let i = 0; i < maxLength; i++) {
    updateElement(currentNode, newChildren[i], oldChildren[i], i)
  }

  // 5-3. 불필요한 자식 노드 제거
  // TODO: oldNode의 자식 수가 더 많은 경우, 남은 자식 노드들을 제거
  while (currentNode.childNodes.length > newChildren.length) {
    currentNode.removeChild(currentNode.lastChild)
  }
}

// TODO: renderElement 함수 구현
// TODO: renderElement 함수 구현
export function renderElement(vNode, container) {
  // 최상위 수준의 렌더링 함수입니다.
  // - 이전 vNode와 새로운 vNode를 비교하여 업데이트
  // - 최초 렌더링과 업데이트 렌더링 처리
  const processedVNode = processVNode(vNode)
  updateElement(container, processedVNode, container._vNode)
  container._vNode = processedVNode
  // 이벤트 위임 설정
  // TODO: 렌더링이 완료된 후 setupEventListeners 함수를 호출하세요.
  // 이는 루트 컨테이너에 이벤트 위임을 설정하여 모든 하위 요소의 이벤트를 효율적으로 관리합니다.
  setupEventListeners(container)
}
