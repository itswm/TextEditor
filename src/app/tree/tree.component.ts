import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TreeNode } from 'angular-tree-component';
import { TreeService } from './tree.service';

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
    @ViewChild('tree') tree: any;
    @Output() submitted = new EventEmitter<number[]>();
    @Input() selection: number[] = [];

    public options = {};
    public allSelected = false;
    public isLoading = true;
    public nodes: any[];

    private nodeReferences: any[] = [];

    constructor(private _treeService: TreeService) {}

    public ngOnInit(): void {
        this._treeService.getTree().subscribe((nodes: any[]) => {
            this.nodes = nodes;
            this.isLoading = false;
            this.flattenTree();
            this.mergeTreeWithInput();
            setTimeout(() => this.expandSelectedNodes());
        });
    }

    public onNodeClick(node: TreeNode): void {
        node.data.selected = !node.data.selected;
        if (node.children) {
            node.children.forEach(child => this.updateNodeSelection(child, node.data.selected));
        }
    }

    public selectAll(): void {
        this.allSelected = !this.allSelected;
        this.nodeReferences.forEach((item: any) => item.selected = this.allSelected);
    }

    public submit(): void {
        const results = this.nodeReferences.filter(o => o.selected).map(item => (item.id));
        this.submitted.emit(results);
    }

    private mergeTreeWithInput(): void {
        if (this.selection && this.selection.length) {
            this.nodeReferences.forEach(nodeRef => {
                if (this.selection.find(id => id === nodeRef.id)) {
                    nodeRef.selected = true;
                }
            });
        }
    }

    private updateNodeSelection(node: any, state: boolean): void {
        if (node.children && node.children.length) {
            node.data.selected = state;
            for (const child of node.children) {
                this.updateNodeSelection(child, state);
            }
        }
        else {
            node.data.selected = state;
        }
    }

    private flattenTree(): void {
        for (const node of this.nodes) {
            this.flattenTreeNode(node)
        }
    }

    private flattenTreeNode(node: any): void {
        if (node.children && node.children.length) {
            this.nodeReferences.push(node);
            for (const child of node.children) {
                this.flattenTreeNode(child);
            }
        }
        else {
            this.nodeReferences.push(node);
        }
    }

    private expandSelectedNodes(): void {
        this.nodeReferences.forEach((nodeRef: any) => {
            if (nodeRef.selected) {
                const treeNode: TreeNode = this.tree.treeModel.getNodeById(nodeRef.id);
                if (treeNode) {
                    let currentNode = treeNode.parent;
                    while (currentNode) {
                        currentNode.expand();
                        currentNode = currentNode.parent;
                    }
                }
            }
        });
    }
}
