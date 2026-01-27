export interface IVertex {
  x: number;
  y: number;
  data?: VertexData
}

export interface IEdge {
  from: IVertex;
  to: IVertex;
}

export abstract class BaseGraph<VertexType extends IVertex, EdgeType extends IEdge> {
  public abstract getVertices(): Iterable<VertexType>;
  public abstract getEdges(): Iterable<EdgeType>;
}

export class Graph extends BaseGraph<Vertex, IEdge> {
  public vertices: Vertex[] = $state([]);

  public createVertex(data: VertexData = {}) {
    let vertex = new Vertex(this);
    Object.assign(vertex.data, data);
    this.vertices.push(vertex);
    return vertex;
  }

  public getVertices(): Iterable<Vertex> {
    return this.vertices;
  }

  public getEdges(): Iterable<IEdge> {
    let vertices = this.vertices;
    return (function* () {
      for (let vertex of vertices) {
        for (let successor of vertex.successors) {
          yield {
            from: vertex,
            to: successor
          } as IEdge
        }
      }
    })()
  }
}

export class Vertex implements IVertex {
  protected graph: Graph;
  public successors: Set<Vertex>;
  public x: number = $state(0);
  public y: number = $state(0);

  data: VertexData = $state({});

  constructor(graph: Graph) {
    this.graph = graph;
    this.successors = new Set();
  }

  public link(other: Vertex) {
    this.successors.add(other);
  }

  public unlink(other: Vertex) {
    this.successors.delete(other);
  }
}

export interface VertexData {
  class?: string;
  content?: string;
}