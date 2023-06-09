import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IClient, IClientAddress } from 'src/app/interfaces/client';
import { ClientsService } from 'src/app/services/clients.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css'],
})
export class EditClientComponent {
  constructor(
    private clientService: ClientsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  editClientForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    cpf: new FormControl({}, Validators.required),
    telefone: new FormControl({}, Validators.required),
    rendimentoMensal: new FormControl({}, Validators.required),
    rua: new FormControl('', Validators.required),
    cep: new FormControl({}, Validators.required),
    numero: new FormControl({}, Validators.required),
  });

  ngOnInit() {
    const cpf = Number(this.route.snapshot.paramMap.get('cpf'));
    if (cpf) {
      this.clientService.getClintByCpf(cpf).subscribe((client: IClient) => {
        console.log(client);
        this.editClientForm.setValue({
          nome: client.nome,
          cpf: client.cpf,
          telefone: client.telefone,
          rendimentoMensal: client.rendimentoMensal,
          rua: client.endereco.rua,
          cep: client.endereco.cep,
          numero: client.endereco.numero,
        });
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }
  }

  edit() {
    const cpf = Number(this.route.snapshot.paramMap.get('cpf'));
    const client: IClientAddress = this.editClientForm.value as IClientAddress;
    const saveClient: IClient = {
      nome: client.nome,
      cpf: client.cpf,
      telefone: client.telefone,
      rendimentoMensal: client.rendimentoMensal,
      endereco: {
        rua: client.rua,
        cep: client.cep,
        numero: client.numero,
      },
    };
    this.clientService.editClient(cpf, saveClient).subscribe(
      (result) => {
        Swal.fire({
          icon: 'success',
          title: 'Client saved',
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(function () {}, 2000);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="">Why do I have this issue?</a>',
        });
      }
    );
  }

  refreshPagAfterButton(redirectedPage: string) {
    setTimeout(() => {
      this.router.navigate([`${redirectedPage}`]);
    }, 2000);
  }
}
