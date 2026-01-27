export class Graph {
  public vertices: Vertex[] = $state([]);
  public edges: Edge[] = $state([]);
  public readonly undirected: boolean;

  constructor(undirected: boolean = true) {
    this.undirected = undirected;
  }

  public createVertex(data: VertexData = {}) {
    let v = new Vertex(this);
    Object.assign(v.data, data); 
    this.vertices.push(v);
    return v;
  }

  public createEdge(first: Vertex, second: Vertex) {
    this.edges.push(new Edge(this, first, second));
  }
}

export class Vertex {
  protected graph: Graph;
  public x: number = $state(0);
  public y: number = $state(0);

  data: VertexData = $state({});

  constructor(graph: Graph) {
    this.graph = graph;
  }

  public link(other: Vertex) {
    this.graph.createEdge(this, other);
  }
}

export interface VertexData {
  class?: string;
  content?: string;
}

export class Edge {
  protected graph: Graph;
  public a: Vertex;
  public b: Vertex;

  constructor(graph: Graph, a: Vertex, b: Vertex) {
    this.graph = graph;
    this.a = a;
    this.b = b;
  }
}