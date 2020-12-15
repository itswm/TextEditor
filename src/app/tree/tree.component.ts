import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { TreeNode } from 'angular-tree-component';

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnChanges, AfterViewInit {
    @ViewChild('tree') tree;
    @Output() submitted = new EventEmitter<number[]>();
    @Input() selection: number[] = [];

    public options = {};
    public allSelected = false;
    public nodes: any[] = [
        {
            id: 1,
            selected: false,
            name: 'root1',
            children: [
                { id: 2, name: 'child1', selected: false },
                { id: 3, name: 'child2', selected: false }
            ]
        },
        {
            id: 4,
            name: 'root2',
            selected: false,
            children: [
                { id: 5, name: 'child2.1', selected: false },
                {
                    id: 6,
                    name: 'child2.2',
                    selected: false,
                    children: [
                        {
                            id: 7,
                            name: 'child2.2.1',
                            selected: false,
                            children: [{ id: 8, name: 'child2.2.1.1', selected: false }]
                        }
                    ]
                }
            ]
        }
    ];

    private flatTree: any[] = [];

    constructor() {
        this.flattenTree();
    }

    public ngOnChanges(): void {
        if (this.selection && this.selection.length) {
            this.flatTree.forEach(item => {
                if (this.selection.find(id => id === item.id)) {
                    item.selected = true;
                }
            });
            console.log(this.flatTree);
        }
    }

    public ngAfterViewInit(): void {
        for (const root of this.tree.treeModel.roots) {
            root.expand();
        }
    }

    public onNodeClick(node: TreeNode): void {
        node.data.selected = !node.data.selected;
        if (node.children) {
            node.children.forEach(child => this.updateNodeSelection(child, node.data.selected));
        }
    }

    public selectAll(): void {
        this.allSelected = !this.allSelected;
        this.flatTree.forEach((item: any) => item.selected = this.allSelected);
    }

    public submit(): void {
        const results = this.flatTree.filter(o => o.selected).map(item => (item.id));
        this.submitted.emit(results);
    }

    private flattenTree(): void {
        for (const node of this.nodes) {
            this.flattenTreeNode(node)
        }
    }

    private flattenTreeNode(node: any): void {
        if (node.children && node.children.length) {
            this.flatTree.push(node);
            for (const child of node.children) {
                this.flattenTreeNode(child);
            }
        }
        else {
            this.flatTree.push(node);
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
}
