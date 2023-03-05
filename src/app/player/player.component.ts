import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PlayerService } from '../player.service';
import { Player } from '../player';
import { PlayerFormComponent } from '../player-form/player-form.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  displayedColumns: string[] = ['firstname', 'lastname', 'touchdowns', 'rushingyards', 'actions'];
  dataSource!: MatTableDataSource<Player>;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private playerService: PlayerService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.playerService.getPlayers().subscribe((players: Player[]) => {
      this.dataSource = new MatTableDataSource<Player>(players);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingResults = false;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addPlayer(): void {
    const dialogRef = this.dialog.open(PlayerFormComponent, {
      width: '500px',
      data: { type: 'add' }
    });

    dialogRef.afterClosed().subscribe(player => {
      if (player) {
        this.playerService.addPlayer(player).subscribe(() => {
          this.playerService.getPlayers().subscribe(players => {
            this.dataSource = new MatTableDataSource<Player>(players);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.snackBar.open('Player added successfully', 'OK', {
              duration: 3000
            });
          });
        });
      }
    });
  }

  editPlayer(player: Player): void {
    const dialogRef = this.dialog.open(PlayerFormComponent, {
      width: '500px',
      data: { type: 'edit', player: Object.assign({}, player) }
    });

    dialogRef.afterClosed().subscribe(editedPlayer => {
      if (editedPlayer) {
        this.playerService.editPlayer(editedPlayer).subscribe(() => {
          this.playerService.getPlayers().subscribe(players => {
            this.dataSource = new MatTableDataSource<Player>(players);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.snackBar.open('Player updated successfully', 'OK', {
              duration: 3000
            });
          });
        });
      }
    });
  }

  deletePlayer(id: string) {
    if (window.confirm('Are you sure you want to delete this player?')) {
      this.playerService.deletePlayer(id).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(
          (player) => player._id !== id
        );
      });
    }
  }

}
