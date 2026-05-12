using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ofiador.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFatura : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdFatura",
                table: "Compras",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "fatura",
                columns: table => new
                {
                    id_fatura = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    valor_total = table.Column<decimal>(type: "numeric", nullable: false),
                    vencimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    parcelas = table.Column<int>(type: "integer", nullable: false),
                    mes_referencia = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    data_geracao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    id_cliente = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fatura", x => x.id_fatura);
                    table.ForeignKey(
                        name: "FK_fatura_Clientes_id_cliente",
                        column: x => x.id_cliente,
                        principalTable: "Clientes",
                        principalColumn: "IdCliente",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Compras_IdFatura",
                table: "Compras",
                column: "IdFatura");

            migrationBuilder.CreateIndex(
                name: "IX_fatura_id_cliente",
                table: "fatura",
                column: "id_cliente");

            migrationBuilder.AddForeignKey(
                name: "FK_Compras_fatura_IdFatura",
                table: "Compras",
                column: "IdFatura",
                principalTable: "fatura",
                principalColumn: "id_fatura");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Compras_fatura_IdFatura",
                table: "Compras");

            migrationBuilder.DropTable(
                name: "fatura");

            migrationBuilder.DropIndex(
                name: "IX_Compras_IdFatura",
                table: "Compras");

            migrationBuilder.DropColumn(
                name: "IdFatura",
                table: "Compras");
        }
    }
}
