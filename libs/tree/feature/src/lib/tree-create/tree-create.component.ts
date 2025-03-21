import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TreeNode,
  Tree,
  TreeStatus,
  TreeRootNode,
  NodeAction,
  NodeWidget,
} from '@closing/shared/interfaces';
import { SidebarModule } from 'primeng/sidebar';
import * as d3 from 'd3';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/inputtextarea';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import * as _ from 'lodash';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TreeStore } from '@closing/tree/data-access';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
type LinkData = {
  source: d3.HierarchyPointNode<TreeNode>;
  target: d3.HierarchyPointNode<TreeNode>;
};

@Component({
  selector: 'lib-tree-create-feature',
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    AvatarModule,
    InputTextModule,
    Textarea,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    DrawerModule,
    DividerModule,
    MenuModule,
    TooltipModule,
    DialogModule,
  ],
  standalone: true,
  templateUrl: './tree-create.component.html',
  host: {
    class: 'h-full w-full',
  },
})
export class TreeCreateComponent implements OnInit, AfterViewInit {
  private store = inject(TreeStore);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  @ViewChild('treeContainer', { static: true }) treeContainer!: ElementRef;

  private createNodeFormGroup(node: TreeNode): FormGroup {
    return this.formBuilder.group({
      id: [node.id || uuidv4(), [Validators.required]],
      name: [node.name, [Validators.required, Validators.minLength(3)]],
      description: [node.description || ''],
      createdAt: [node.createdAt || new Date()],
      updatedAt: [node.updatedAt || new Date()],
      archivedAt: [node.archivedAt],
      createdBy: [node.createdBy],
      updatedBy: [node.updatedBy],
      archivedBy: [node.archivedBy],
      widgets: this.formBuilder.array(node.widgets || []),
      actions: this.formBuilder.array(node.actions || []),
      children: this.formBuilder.array(
        (node.children || []).map((child) => this.createNodeFormGroup(child))
      ),
      x: [node.x || 0],
      y: [node.y || 0],
    });
  }

  protected widgetItems: MenuItem[] = [
    {
      label: 'Inputs',
      icon: 'fas fa-keyboard',
      items: [
        {
          label: 'File',
          icon: 'fas fa-file-plus',
          command: () => this.addFileToNode(),
        },
        {
          label: 'Form',
          icon: 'fas fa-file-lines',
          command: () => this.addFormToNode(),
        },
        {
          label: 'Date Picker',
          icon: 'fas fa-calendar',
          command: () => this.addDatePickerToNode(),
        },
        {
          label: 'Checklist',
          icon: 'fas fa-list-check',
          command: () => this.addChecklistToNode(),
        },
      ],
    },
    {
      label: 'Communication',
      icon: 'fas fa-comments',
      items: [
        {
          label: 'Comments',
          icon: 'fas fa-comment-dots',
          command: () => this.addCommentsToNode(),
        },
      ],
    },
    {
      label: 'External Content',
      icon: 'fas fa-globe',
      items: [
        {
          label: 'Embedded Link',
          icon: 'fas fa-link',
          command: () => this.addEmbeddedLinkToNode(),
        },
        {
          label: 'Google Maps Place',
          icon: 'fas fa-map-location-dot',
          command: () => this.addGoogleMapsPlaceToNode(),
        },
      ],
    },
  ];

  protected actionItems: MenuItem[] = [
    {
      label: 'Basic',
      icon: 'fas fa-cube',
      items: [
        {
          label: 'Send Email',
          icon: 'fas fa-envelope',
          command: () => this.addAction('email'),
        },
      ],
    },
    {
      label: 'HubSpot',
      icon: 'fas fa-building',
      items: [
        {
          label: 'Create Prospect',
          icon: 'fas fa-user-plus',
          command: () => this.addAction('hubspot_prospect'),
        },
        {
          label: 'Update Deal Stage',
          icon: 'fas fa-chart-line',
          command: () => this.addAction('hubspot_update_deal'),
        },
      ],
    },
    {
      label: 'Salesforce',
      icon: 'fas fa-cloud',
      items: [
        {
          label: 'Create Lead',
          icon: 'fas fa-user-plus',
          command: () => this.addAction('salesforce_create_lead'),
        },
        {
          label: 'Update Opportunity',
          icon: 'fas fa-chart-line',
          command: () => this.addAction('salesforce_update_opportunity'),
        },
      ],
    },
    {
      label: 'Teams',
      icon: 'fas fa-users',
      items: [
        {
          label: 'Send Message',
          icon: 'fas fa-envelope',
          command: () => this.addAction('team_message'),
        },
      ],
    },
    {
      label: 'Slack',
      icon: 'fab fa-slack',
      items: [
        {
          label: 'Send Notification',
          icon: 'fas fa-bell',
          command: () => this.addAction('slack_notification'),
        },
      ],
    },
    {
      label: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      items: [
        {
          label: 'Send WhatsApp Message',
          icon: 'fas fa-comment',
          command: () => this.addAction('whatsapp_message'),
        },
      ],
    },
    {
      label: 'Google Calendar',
      icon: 'fas fa-calendar',
      items: [
        {
          label: 'Schedule Meeting',
          icon: 'fas fa-clock',
          command: () => this.addAction('google_calendar_meeting'),
        },
      ],
    },
    {
      label: 'DocuSign',
      icon: 'fas fa-file-signature',
      items: [
        {
          label: 'Send Contract',
          icon: 'fas fa-file-pdf',
          command: () => this.addAction('docusign_send_contract'),
        },
      ],
    },
    {
      label: 'Stripe',
      icon: 'fab fa-stripe',
      items: [
        {
          label: 'Create Invoice',
          icon: 'fas fa-file-invoice',
          command: () => this.addAction('stripe_create_invoice'),
        },
        {
          label: 'Process Payment',
          icon: 'fas fa-credit-card',
          command: () => this.addAction('stripe_process_payment'),
        },
      ],
    },
  ];

  protected form: FormGroup = this.formBuilder.group({
    _id: [uuidv4(), [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['A default tree node structure'],
    status: [TreeStatus.ACTIVE],
    permissions: [[]],
    createdAt: [new Date()],
    updatedAt: [new Date()],
    archivedAt: [null],
    createdBy: [null],
    updatedBy: [null],
    archivedBy: [null],
    icon: ['fa-project-diagram'],
    rootNode: this.createNodeFormGroup({
      id: uuidv4(),
      name: 'Root Node',
      description: 'A default root node structure',
      actions: [],
      widgets: [],
      children: [],
    }),
  });

  protected editedTree: Partial<Tree> = _.cloneDeep(this.form.value);
  protected editMode: boolean = false;

  protected get isEqual(): boolean {
    return _.isEqual(this.editedTree, this.form.value);
  }

  protected sidebarVisible: boolean = false;
  protected selectedNode: TreeNode | null = null;
  protected isRootNode: boolean = false;

  protected deleteDialogVisible: boolean = false;

  private svg: any;
  private container: any;
  private width = 0;
  private height = 0;
  private nodeIdCounter = 1;
  private zoom: any;
  private button: any;
  private deleteButton: any;
  private currentRotation = 0;
  private isVertical = false;
  private drag: any;
  private highlightedNode: TreeNode | null = null;

  ngOnInit(): void {
    this.form.get('name')?.valueChanges.subscribe(() => {
      this.form.markAllAsTouched();
    });
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.initializeSvg();
    this.initializeTree();
  }

  protected resetTree(): void {
    this.form.patchValue({
      _id: uuidv4(),
      name: 'New Tree',
      description: 'A new tree structure',
      status: TreeStatus.ACTIVE,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      archivedAt: null,
      createdBy: null,
      updatedBy: null,
      archivedBy: null,
      icon: 'fa-project-diagram',
      rootNode: this.editedTree.rootNode,
    });
  }

  protected createTree(): void {
    if (this.form.valid) {
      const treeData = this.form.value;
      this.store.createTree(treeData);
      this.router.navigate(['/tree']);
    }
  }

  protected saveTitle(): void {
    if (this.form.get('name')?.valid) {
      this.editedTree = {
        ...this.editedTree,
        name: this.form.get('name')?.value,
      };
      this.editMode = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setDimensions();
    this.renderTree();
  }

  private setDimensions(): void {
    const element = this.treeContainer.nativeElement;
    this.width = element.clientWidth;
    this.height = element.clientHeight;
  }

  private initializeSvg(): void {
    const width = this.treeContainer.nativeElement.clientWidth;
    const height = this.treeContainer.nativeElement.clientHeight;

    this.zoom = d3
      .zoom()
      .scaleExtent([0.1, 1])
      .on('zoom', (event) => {
        this.container.attr('transform', event.transform);
      });

    this.svg = d3
      .select(this.treeContainer.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .call(this.zoom);

    // Create container with initial transform
    this.container = this.svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Set initial zoom transform
    this.svg.call(
      this.zoom.transform,
      d3.zoomIdentity.translate(width / 2, height / 2)
    );
  }

  private updateLinks(): void {
    // Update links with smooth curves
    this.container.selectAll('.link').attr('d', (d: LinkData) => {
      const sourceX = d.source.x;
      const sourceY = d.source.y;
      const targetX = d.target.x;
      const targetY = d.target.y;

      // Calculate control points for the curve
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const controlX1 = sourceX + dx * 0.5;
      const controlY1 = sourceY;
      const controlX2 = sourceX + dx * 0.5;
      const controlY2 = targetY;

      // Create a smooth curve using cubic Bézier
      return `M${sourceX},${sourceY}
              C${controlX1},${controlY1}
               ${controlX2},${controlY2}
               ${targetX},${targetY}`;
    });
  }

  private initializeTree(): void {
    this.renderTree();
  }

  private renderTree(): void {
    // Adjust nodeSize to account for dynamic text size
    const treeLayout = d3
      .tree<TreeNode>()
      .nodeSize(this.isVertical ? [150, 100] : [100, 150]) // Adjust node sizing based on orientation
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));

    const root = d3.hierarchy<TreeNode>(
      this.editedTree.rootNode as unknown as TreeNode,
      (d) => d.children || []
    );

    // Store previous node positions before computing new layout
    const oldPositions = new Map();
    if (this.container) {
      this.container.selectAll('.node').each((d: any) => {
        oldPositions.set(d.data.id, { x: d.x, y: d.y });
      });
    }

    treeLayout(root);

    // Handle coordinates based on orientation and preserve old positions
    root.descendants().forEach((node) => {
      const oldPos = oldPositions.get(node.data.id);
      if (oldPos) {
        // Keep old position for existing nodes
        node.x = oldPos.x;
        node.y = oldPos.y;
        // Save position to node data
        node.data.x = oldPos.x;
        node.data.y = oldPos.y;
      } else if (!this.isVertical) {
        // Only adjust new nodes for horizontal layout
        const temp = node.x;
        node.x = node.y;
        node.y = temp;
        // Save position to node data
        node.data.x = node.x;
        node.data.y = node.y;
      } else {
        // Save position to node data for vertical layout
        node.data.x = node.x;
        node.data.y = node.y;
      }
    });

    const nodes = root.descendants();
    const links = root.links();

    this.container.selectAll('*').remove();

    // Draw links with smooth curves
    this.container
      .selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d: LinkData) => {
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;

        // Calculate control points for the curve
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const controlX1 = sourceX + dx * 0.5;
        const controlY1 = sourceY;
        const controlX2 = sourceX + dx * 0.5;
        const controlY2 = targetY;

        // Create a smooth curve using cubic Bézier
        return `M${sourceX},${sourceY}
                C${controlX1},${controlY1}
                 ${controlX2},${controlY2}
                 ${targetX},${targetY}`;
      })
      .style('stroke', '#999')
      .style('fill', 'none')
      .style('stroke-width', 2)
      .style('stroke-linecap', 'round')
      .style('stroke-linejoin', 'round');

    // Draw nodes
    const nodeGroup = this.container
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr(
        'transform',
        (d: d3.HierarchyPointNode<TreeNode>) => `translate(${d.x},${d.y})`
      )
      .call(
        d3
          .drag()
          .on('start', (event: any, d: any) => {
            if (d.data === this.selectedNode) {
              event.sourceEvent.stopPropagation();
            }
          })
          .on('drag', (event: any, d: any) => this.handleDrag(event, d))
          .on('end', (event: any, d: any) => {
            if (d.data === this.selectedNode) {
              // Final position save after drag ends
              d.data.x = d.x;
              d.data.y = d.y;

              // Update the form with final values
              const rootNodeControl = this.form.get('rootNode') as FormGroup;
              if (rootNodeControl) {
                this.updateNodeInFormStructure(rootNodeControl, d.data.id);
              }
            }
          })
      )
      .on('click', (_: Event, d: d3.HierarchyPointNode<TreeNode>) =>
        this.onNodeClick(d.data)
      );

    // Create foreignObject to embed HTML
    nodeGroup
      .append('foreignObject')
      .attr('width', 120)
      .attr('height', 100)
      .attr('x', -60)
      .attr('y', -30);

    // Create HTML content
    nodeGroup
      .select('foreignObject')
      .append('xhtml:div')
      .attr('class', 'tree-node')
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('align-items', 'center')
      .style('position', 'relative')
      .style('padding-bottom', '20px')
      .each(function (this: HTMLElement, d: d3.HierarchyPointNode<TreeNode>) {
        const div = d3.select(this);

        // Add container for icon
        const iconContainer = div
          .append('div')
          .attr(
            'class',
            'bg-white dark:bg-gray-800 flex items-center justify-center rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer w-[60px] h-[60px] mb-2 border-2 border-gray-400'
          );

        // Add icon to container
        iconContainer
          .append('i')
          .attr('class', 'fas fa-folder text-emerald-500')
          .style('font-size', '24px');

        // Add name below container
        div
          .append('div')
          .attr(
            'class',
            'text-inherit dark:text-white text-gray-700 text-sm font-medium text-center max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap absolute bottom-0 left-1/2'
          )
          .style('transform', 'translateX(-50%)')
          .text(d.data.name);

        // Add hover effect to icon container
        iconContainer
          .on('mouseover', function () {
            d3.select(this)
              .classed('shadow-md', true)
              .classed('shadow-sm', false);
          })
          .on('mouseout', function () {
            const node = d3.select(this);
            // Only reset if not selected
            if (!node.classed('selected')) {
              node.classed('shadow-sm', true).classed('shadow-md', false);
            }
          });
      });

    // Update rectangle size based on content
    nodeGroup.each(
      (_: d3.HierarchyPointNode<TreeNode>, i: number, nodes: SVGGElement[]) => {
        const group = d3.select(nodes[i]);
        const foreignObject = group
          .select('foreignObject')
          .attr('width', 120)
          .attr('height', 100)
          .attr('x', -60)
          .attr('y', -30);
      }
    );

    // Automatically select the root node after rendering
    if (this.editedTree.rootNode) {
      this.onNodeClick(this.editedTree.rootNode);
    }

    console.log(this.form.value);
  }

  private findChildFormArray(
    formGroup: FormGroup,
    nodeId: string,
    path: string[] = []
  ): { formArray: FormArray; path: string[] } | null {
    const childrenArray = formGroup.get('children') as FormArray;
    if (!childrenArray) return null;

    // Check each child in the current level
    for (let i = 0; i < childrenArray.length; i++) {
      const childFormGroup = childrenArray.at(i) as FormGroup;
      const currentPath = [...path, i.toString()];

      // Check if this is the parent we're looking for
      const nodeData = this.findNodeByFormGroup(childFormGroup);
      if (nodeData?.id === nodeId) {
        return {
          formArray: childFormGroup.get('children') as FormArray,
          path: currentPath,
        };
      }

      // Recursively search in children
      const result = this.findChildFormArray(
        childFormGroup,
        nodeId,
        currentPath
      );
      if (result) return result;
    }

    return null;
  }

  private findNodeByFormGroup(formGroup: FormGroup): TreeNode | null {
    const name = formGroup.get('name')?.value;
    const description = formGroup.get('description')?.value;

    const findNode = (node: TreeNode): TreeNode | null => {
      if (node.name === name && node.description === description) {
        return node;
      }

      if (node.children) {
        for (const child of node.children) {
          const result = findNode(child);
          if (result) return result;
        }
      }

      return null;
    };

    return this.editedTree.rootNode ? findNode(this.editedTree.rootNode) : null;
  }

  protected addNode(): void {
    const parentId = this.selectedNode?.id;

    if (!parentId || !this.editedTree.rootNode) return;

    // Find parent node's position in the D3 visualization
    const parentElement = this.container
      .selectAll('.node')
      .filter((d: d3.HierarchyPointNode<TreeNode>) => d.data.id === parentId);

    if (parentElement.empty()) return;

    const parentData = parentElement.datum() as d3.HierarchyPointNode<TreeNode>;
    const horizontalOffset = 200;

    const newNode: TreeNode = {
      id: uuidv4(),
      name: 'New Node',
      description: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      actions: [],
      widgets: [],
      children: [],
      x: parentData.x + horizontalOffset,
      y: parentData.y,
    };

    // Update the tree data structure
    const parentNode = this.findNode(this.editedTree.rootNode, parentId);
    if (parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push(newNode);

      // Update the form structure by recreating the entire rootNode form
      const updatedRootNode = _.cloneDeep(this.editedTree.rootNode);
      this.form.setControl(
        'rootNode',
        this.createNodeFormGroup(updatedRootNode)
      );

      // Re-render the tree
      this.renderTree();

      // After rendering, explicitly select the new node
      setTimeout(() => {
        this.onNodeClick(newNode);

        // Find and scroll to the new node
        const newNodeElement = this.container
          .selectAll('.node')
          .filter(
            (d: d3.HierarchyPointNode<TreeNode>) => d.data.id === newNode.id
          );

        if (!newNodeElement.empty()) {
          const transform = d3.zoomTransform(this.svg.node());
          const nodeData = newNodeElement.datum();
          const scale = transform.k;

          // Calculate the position to center the new node
          const x = -nodeData.x * scale + this.width / 2;
          const y = -nodeData.y * scale + this.height / 2;

          // Smoothly transition to the new node
          this.svg
            .transition()
            .duration(750)
            .call(
              this.zoom.transform,
              d3.zoomIdentity.translate(x, y).scale(scale)
            );
        }
      }, 0);
    }
  }

  protected removeNode(): void {
    const nodeId = this.selectedNode?.id;
    if (!nodeId || !this.editedTree.rootNode) return;

    // Don't allow removing the root node
    if (nodeId === this.editedTree.rootNode.id) {
      return;
    }

    // Find the parent node in the tree structure
    const parentNode = this.findParentNode(this.editedTree.rootNode, nodeId);
    if (parentNode && parentNode.children) {
      // Store the parent node before removing the selected node
      const parentToSelect = parentNode;

      // Remove the node from the children array
      parentNode.children = parentNode.children.filter(
        (child: TreeNode) => child.id !== nodeId
      );

      // Update the form structure by recreating the entire rootNode form
      const updatedRootNode = _.cloneDeep(this.editedTree.rootNode);
      this.form.setControl(
        'rootNode',
        this.createNodeFormGroup(updatedRootNode)
      );

      // Re-render the tree
      this.renderTree();

      // Select the parent node after removal
      setTimeout(() => {
        this.onNodeClick(parentToSelect);
      }, 0);

      // Close the delete dialog if it's open
      this.deleteDialogVisible = false;
    }

    console.log(this.form.value);
  }

  private findNode(node: TreeRootNode | TreeNode, id: string): TreeNode | null {
    if (node.id === id) {
      return node as TreeNode;
    }

    if ('children' in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        const found = this.findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  private findParentNode(
    node: Tree | TreeRootNode | TreeNode,
    id: string
  ): TreeNode | null {
    // Handle Tree type
    if ('rootNode' in node && !('children' in node)) {
      return this.findParentNode(node.rootNode, id);
    }

    // Handle TreeRootNode and TreeNode types
    if ('children' in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        if (child.id === id) {
          return node as TreeNode;
        }
        const found = this.findParentNode(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  protected onSubmitNodeForm(): void {
    if (!this.selectedNode || !this.form.valid) return;

    const rootNodeControl = this.form.get('rootNode') as FormGroup;
    if (!rootNodeControl) return;

    // Find and update the selected node in the form structure
    this.updateNodeInFormStructure(rootNodeControl, this.selectedNode.id ?? '');

    this.renderTree();
  }

  private updateNodeInFormStructure(
    formGroup: FormGroup,
    nodeId: string
  ): boolean {
    if (formGroup.get('id')?.value === nodeId) {
      // Update the node's position
      formGroup.patchValue({
        x: (this.selectedNode?.x || 0).toString(),
        y: (this.selectedNode?.y || 0).toString(),
      });
      return true;
    }

    const childrenArray = formGroup.get('children') as FormArray;
    if (!childrenArray) return false;

    for (let i = 0; i < childrenArray.length; i++) {
      const childGroup = childrenArray.at(i) as FormGroup;
      if (this.updateNodeInFormStructure(childGroup, nodeId)) {
        return true;
      }
    }

    return false;
  }

  protected addWidget(widgetType: string): void {
    if (!this.selectedNode) return;

    const widget: NodeWidget = {
      id: uuidv4(),
      type: widgetType,
      config: {},
    };

    if (!this.selectedNode.widgets) {
      this.selectedNode.widgets = [];
    }
    this.selectedNode.widgets.push(widget);
    this.renderTree();
  }

  protected addAction(actionType: string = 'button'): void {
    if (!this.selectedNode) return;

    const action: NodeAction = {
      id: uuidv4(),
      name:
        actionType === 'email'
          ? 'Send Email'
          : actionType === 'hubspot_prospect'
          ? 'Create Prospect'
          : 'New Action',
      type: actionType,
      config: {},
    };

    if (!this.selectedNode.actions) {
      this.selectedNode.actions = [];
    }
    this.selectedNode.actions.push(action);
    this.renderTree();
  }

  protected removeAction(action: NodeAction): void {
    if (!this.selectedNode?.actions) return;

    this.selectedNode.actions = this.selectedNode.actions.filter(
      (a: NodeAction) => a.id !== action.id
    );
    this.renderTree();
  }

  protected removeWidget(widget: NodeWidget): void {
    if (!this.selectedNode?.widgets) return;

    this.selectedNode.widgets = this.selectedNode.widgets.filter(
      (w) => w.id !== widget.id
    );
    this.renderTree();
  }

  protected onNodeClick(selectedNode: TreeNode): void {
    // Store current transform before making changes
    const currentTransform = d3.zoomTransform(this.svg.node());

    // Update isRootNode status
    this.isRootNode = selectedNode.id === this.editedTree.rootNode?.id;

    // Hide all connection points and lines first
    this.container.selectAll('.connection-group').style('display', 'none');

    // Reset styling for all nodes first
    this.container
      .selectAll('.node')
      .selectAll('foreignObject')
      .selectAll('.tree-node')
      .selectAll('div')
      .classed('selected', false)
      .classed('border-emerald-500', false)
      .classed('border-gray-400', true)
      .classed('shadow-md', false)
      .classed('shadow-sm', true);

    // Show connection points and lines only for the selected node
    const selectedNodeElement = this.container
      .selectAll('.node')
      .filter((d: d3.HierarchyPointNode<TreeNode>) => d.data === selectedNode);

    selectedNodeElement
      .selectAll('.connection-group')
      .style('display', 'block');

    // Apply styling to the selected node's icon container
    selectedNodeElement
      .select('foreignObject')
      .select('.tree-node')
      .select('div')
      .classed('selected', true)
      .classed('border-gray-400', false)
      .classed('border-emerald-500', true)
      .classed('shadow-sm', false)
      .classed('shadow-md', true)
      .style('border-width', '2px');

    // Update cursor and drag behavior based on selection
    this.container
      .selectAll('.node')
      .select('foreignObject')
      .select('.tree-node')
      .select('div')
      .style('cursor', (d: any) =>
        d.data === selectedNode ? 'move' : 'pointer'
      );

    // Get the selected node's position and create a smooth transition
    const nodeData =
      selectedNodeElement.datum() as d3.HierarchyPointNode<TreeNode>;
    if (nodeData) {
      const scale = currentTransform.k; // Maintain current zoom level

      // Calculate the position to center the selected node
      const x = -nodeData.x * scale + this.width / 2;
      const y = -nodeData.y * scale + this.height / 2;

      // Smoothly transition to the selected node
      this.svg
        .transition()
        .duration(750) // Match the duration used in addNode
        .ease(d3.easeCubicInOut) // Add smooth easing
        .call(
          this.zoom.transform,
          d3.zoomIdentity.translate(x, y).scale(scale)
        );
    }

    // Update both selected and highlighted nodes
    this.selectedNode = selectedNode;
    this.highlightedNode = selectedNode;

    // Find and select the corresponding node in the form structure
    const rootNodeControl = this.form.get('rootNode') as FormGroup;
    if (rootNodeControl) {
      this.selectNodeInFormStructure(
        rootNodeControl,
        this.selectedNode.id ?? ''
      );
    }

    this.sidebarVisible = true;
  }

  private selectNodeInFormStructure(
    formGroup: FormGroup,
    nodeId: string
  ): boolean {
    if (formGroup.get('id')?.value === nodeId) {
      // Node found, update form values
      formGroup.patchValue({
        name: this.selectedNode?.name,
        description: this.selectedNode?.description,
        createdAt: this.selectedNode?.createdAt || new Date(),
        updatedAt: this.selectedNode?.updatedAt || new Date(),
        archivedAt: this.selectedNode?.archivedAt,
        createdBy: this.selectedNode?.createdBy,
        updatedBy: this.selectedNode?.updatedBy,
        archivedBy: this.selectedNode?.archivedBy,
        actions: this.selectedNode?.actions || [],
        widgets: this.selectedNode?.widgets || [],
        x: this.selectedNode?.x || 0,
        y: this.selectedNode?.y || 0,
      });
      return true;
    }

    const childrenArray = formGroup.get('children') as FormArray;
    if (!childrenArray) return false;

    for (let i = 0; i < childrenArray.length; i++) {
      const childGroup = childrenArray.at(i) as FormGroup;
      if (this.selectNodeInFormStructure(childGroup, nodeId)) {
        return true;
      }
    }

    return false;
  }

  // Update drag event handler
  private handleDrag(event: any, d: any): void {
    if (d.data === this.selectedNode) {
      event.sourceEvent.stopPropagation();
      // Update node position
      d.x = event.x;
      d.y = event.y;
      // Save position to node data
      d.data.x = event.x;
      d.data.y = event.y;
      // Update node transform
      d3.select(event.sourceEvent.target.closest('.node')).attr(
        'transform',
        `translate(${d.x},${d.y})`
      );

      // Update the form values in real-time
      const rootNodeControl = this.form.get('rootNode') as FormGroup;
      if (rootNodeControl) {
        this.updateNodeInFormStructure(rootNodeControl, d.data.id);
      }

      // Update links
      this.updateLinks();
    }
  }

  protected zoomIn(): void {
    this.zoom.scaleBy(this.svg, 1.1);
  }

  protected zoomOut(): void {
    this.zoom.scaleBy(this.svg, 0.9);
  }

  protected rotate(): void {
    // Toggle between vertical and horizontal orientation
    this.isVertical = !this.isVertical;

    // Update rotation angle
    this.currentRotation = this.isVertical ? 90 : 0;

    // Re-render the tree with new orientation
    this.renderTree();

    // Get the center point of the SVG for rotation
    const width = this.treeContainer.nativeElement.clientWidth;
    const height = this.treeContainer.nativeElement.clientHeight;

    // Adjust the container position based on orientation
    if (this.isVertical) {
      this.container.attr(
        'transform',
        `translate(${width / 2}, ${height / 2})`
      );
    } else {
      this.container.attr(
        'transform',
        `translate(${width / 2}, ${height / 2})`
      );
    }
  }

  protected deleteTree(): void {
    this.router.navigate(['/tree']);
  }

  protected openAIChat(): void {
    // To be implemented
  }

  protected undo(): void {
    // To be implemented
  }

  protected addDatePickerToNode(): void {
    // To be implemented
  }

  protected addChecklistToNode(): void {
    // To be implemented
  }

  protected addEmbeddedLinkToNode(): void {
    // To be implemented
  }

  protected addGoogleMapsPlaceToNode(): void {
    // To be implemented
  }

  protected addCommentsToNode(): void {
    // To be implemented
  }

  protected addProspectInfoToNode(): void {
    // To be implemented
  }

  protected redo(): void {
    // To be implemented
  }

  protected save(): void {
    // Save positions before saving the tree
    if (this.editedTree.rootNode) {
      this.saveNodePositions(this.editedTree.rootNode);
    }

    if (this.form.valid) {
      const treeData = this.form.value;
      this.store.createTree(treeData);
      this.router.navigate(['/tree']);
    }
  }

  protected export(): void {
    // Create a copy of the tree data without any circular references
    const treeData = {
      _id: this.editedTree._id,
      name: this.editedTree.name,
      description: this.editedTree.description,
      status: this.editedTree.status,
      permissions: this.editedTree.permissions,
      createdAt: this.editedTree.createdAt,
      updatedAt: this.editedTree.updatedAt,
      archivedAt: this.editedTree.archivedAt,
      createdBy: this.editedTree.createdBy,
      updatedBy: this.editedTree.updatedBy,
      archivedBy: this.editedTree.archivedBy,
      icon: this.editedTree.icon,
      rootNode: this.editedTree.rootNode,
    };

    // Convert the tree data to a JSON string with proper formatting
    const jsonString = JSON.stringify(treeData, null, 2);

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.editedTree.name || 'tree'}-${
      new Date().toISOString().split('T')[0]
    }.json`;

    // Append the link to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up by revoking the URL
    window.URL.revokeObjectURL(url);
  }

  protected addFormToNode(): void {
    // To be implemented
  }

  protected addFileToNode(): void {
    // To be implemented
  }

  protected addTodoListToNode(): void {
    // To be implemented
  }

  protected goBack(): void {
    this.router.navigate(['/tree']);
  }

  private saveNodePositions(node: TreeNode) {
    // Recursively save positions for all nodes
    const savePositionsRecursive = (currentNode: TreeNode) => {
      if (currentNode.children) {
        currentNode.children.forEach((child) => {
          // Find the node's position in the D3 visualization
          const nodeElement = this.container
            .selectAll('.node')
            .filter((d: any) => d.data.id === child.id);

          if (!nodeElement.empty()) {
            const nodeData =
              nodeElement.datum() as d3.HierarchyPointNode<TreeNode>;
            child.x = nodeData.x;
            child.y = nodeData.y;

            // Update the form if this is the currently selected node
            if (this.selectedNode && this.selectedNode.id === child.id) {
              this.form.patchValue(
                {
                  x: child.x,
                  y: child.y,
                },
                { emitEvent: false }
              );
            }

            // Recursively save positions for children
            savePositionsRecursive(child);
          }
        });
      }
    };

    savePositionsRecursive(node);
  }
}
