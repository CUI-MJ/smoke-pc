export default class Tree {
  constructor(data, options) {
    this.data = []
    this.nodesMap = {}
    this.setData(data)
    this.props = options.props
  }
  _initNodes(nodes) {
    console.time('Init_Nodes')
    console.log('init nodes', nodes.slice(), Object.assign({}, this.nodesMap))
    nodes.forEach(node => {
      if (node[this.props.id] && !this.nodesMap[node[this.props.id]]) {
        this.nodesMap[node[this.props.id]] = Object.assign({
          checked: false,
          indeterminate: false,
          expanded: false,
          visible: node[this.props.parentId] ? this.nodesMap[node[this.props.parentId]].expanded : true,
          isLeaf: true,
          children: [],
          level: node[this.props.parentId] ? this.nodesMap[node[this.props.parentId]].level + 1 : 0
        }, node)
      } else {
        this.nodesMap[node[this.props.id]].indeterminate = false
        this.nodesMap[node[this.props.id]].isLeaf = true
        this.nodesMap[node[this.props.id]].children = []
        this.nodesMap[node[this.props.id]].visible = node[this.props.parentId] ? this.nodesMap[node[this.props.parentId]].expanded : true
      }
    })
    console.timeEnd('Init_Nodes')
  }
  setData(data) {
    this._initNodes(data)
    if (this.data.length !== 0) {
      this.data = []
    }
    data.forEach(node => {
      this.data.push(this.nodesMap[node[this.props.id]])
      if (this.nodesMap[node[this.props.parentId]]) {
        this.nodesMap[node[this.props.parentId]].children.push(this.nodesMap[node[this.props.id]])
        this.nodesMap[node[this.props.parentId]].isLeaf = false
      }
    })
  }
  getNode(nodeId) {
    return this.nodesMap[nodeId]
  }
  getNodeChildren(nodeId) {
    return this.nodesMap[nodeId].children
  }
  getNodeDescendants(node) {
    let start = this.data.findIndex(n => n[this.props.id] === node[this.props.id])
    let end = 0
    if (start > -1) {
      for (let i = start + 1; i < this.data.length; i++) {
        if (this.data[i].level <= node.level) {
          end = i
          break
        }
      }
      if (end) return this.data.slice(start + 1, end)
      else return this.data.slice(start + 1)
    } else return []
  }
  getNodesState(nodes) {
    let all = true
    let none = true
    let allWithoutDisable = true
    for (let i = 0, j = nodes.length; i < j; i++) {
      const n = nodes[i]
      if (n.checked !== true || n.indeterminate) {
        all = false
        if (!n.disabled) {
          allWithoutDisable = false
        }
      }
      if (n.checked !== false || n.indeterminate) {
        none = false
      }
    }
    return { all, none, allWithoutDisable, half: !all && !none }
  }
  append(data) {
    if (data.parentId) {
      let parent = this.getNode(data[this.props.parentId])
      let newNode = Object.assign({
        checked: this.nodesMap[data[this.props.parentId]].checked,
        indeterminate: false,
        expanded: false,
        visible: this.nodesMap[data[this.props.parentId]].expanded,
        isLeaf: true,
        children: [],
        level: this.nodesMap[data[this.props.parentId]].level + 1        
      }, data)
      let position = this.data.findIndex(n => n[this.props.id] == parent[this.props.id])
      if (parent.children.length) {
        let lastChild
        for(let i = parent.children.length - 1; i >= 0; i--) {
          if (this.nodesMap[parent.children[i][this.props.id]]) {
            lastChild = this.nodesMap[parent.children[i][this.props.id]]
            break
          }
        }
        if (lastChild) {
          position = this.data.findIndex(n => n[this.props.id]== lastChild[this.props.id])
        }
      }
      this.nodesMap[newNode.id] = newNode
      parent.children.push(newNode)
      parent.isLeaf = false
      this.data.splice(position + 1, 0, newNode)
    } else {
      let newNode = Object.assign({
        checked: false,
        indeterminate: false,
        expanded: false,
        visible: true,
        isLeaf: true,
        children: [],
        level: 0        
      }, data)
      this.nodesMap[newNode[this.props.id]] = newNode
      this.data.push(newNode)
    }
  }
}