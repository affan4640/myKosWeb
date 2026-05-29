import OwnerLayout from "@/Layouts/OwnerLayout";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Wallet({
    wallet,
    bankAccounts,
    withdrawals
}) {

    const [showBankForm, setShowBankForm] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        reset
    } = useForm({
        bank_name: "",
        account_name: "",
        account_number: "",
        bank_account_id: "",
        amount: ""
    });

    const submitBank = (e) => {
        e.preventDefault();

        post('/owner/wallet/bank-account', {
            onSuccess: () => {
                reset();
                setShowBankForm(false);
            }
        });
    };

    const submitWithdraw = (e) => {
        e.preventDefault();

        post('/owner/wallet/withdraw', {
            onSuccess: () => reset()
        });
    };

    return (
        <OwnerLayout>

            <div className="p-6 space-y-6">

                {/* SALDO */}
                <div className="
                    p-6 rounded-2xl
                    bg-white dark:bg-dark-card
                    border border-mint-200
                ">
                    <p className="text-sm text-gray-500">
                        Saldo Wallet
                    </p>

                    <h1 className="
                        text-3xl font-bold mt-2
                        text-kost-dark dark:text-white
                    ">
                        Rp {Number(wallet.balance)
                            .toLocaleString('id-ID')}
                    </h1>
                </div>

                {/* REKENING */}
                <div className="
                    p-6 rounded-2xl
                    bg-white dark:bg-dark-card
                    border border-mint-200
                ">
                    <div className="
                        flex items-center justify-between
                        mb-4
                    ">
                        <h2 className="font-semibold">
                            Rekening Bank
                        </h2>

                        <button
                            onClick={() =>
                                setShowBankForm(!showBankForm)
                            }
                            className="
                                px-4 py-2 rounded-lg
                                bg-mint-300 text-white
                            "
                        >
                            Tambah Rekening
                        </button>
                    </div>

                    {/* FORM */}
                    {showBankForm && (
                        <form
                            onSubmit={submitBank}
                            className="space-y-3 mb-6"
                        >

                            <input
                                type="text"
                                placeholder="Nama Bank"
                                value={data.bank_name}
                                onChange={(e) =>
                                    setData(
                                        'bank_name',
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full border rounded-lg p-3
                                "
                            />

                            <input
                                type="text"
                                placeholder="Nama Pemilik Rekening"
                                value={data.account_name}
                                onChange={(e) =>
                                    setData(
                                        'account_name',
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full border rounded-lg p-3
                                "
                            />

                            <input
                                type="text"
                                placeholder="Nomor Rekening"
                                value={data.account_number}
                                onChange={(e) =>
                                    setData(
                                        'account_number',
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full border rounded-lg p-3
                                "
                            />

                            <button
                                type="submit"
                                disabled={processing}
                                className="
                                    px-4 py-2 rounded-lg
                                    bg-mint-300 text-white
                                "
                            >
                                Simpan
                            </button>
                        </form>
                    )}

                    <div className="space-y-3">

                        {bankAccounts.map((bank) => (

                            <div
                                key={bank.id}
                                className="
                                    flex justify-between items-center
                                    border rounded-xl p-4
                                "
                            >
                                <div>
                                    <p className="font-medium">
                                        {bank.bank_name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {bank.account_number}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        {bank.account_name}
                                    </p>
                                </div>

                                <button
                                    className="
                                        text-red-500 text-sm
                                    "
                                >
                                    Hapus
                                </button>
                            </div>

                        ))}

                    </div>
                </div>

                {/* WITHDRAW */}
                <div className="
                    p-6 rounded-2xl
                    bg-white dark:bg-dark-card
                    border border-mint-200
                ">
                    <h2 className="font-semibold mb-4">
                        Withdraw Saldo
                    </h2>

                    <form
                        onSubmit={submitWithdraw}
                        className="space-y-4"
                    >

                        <select
                            value={data.bank_account_id}
                            onChange={(e) =>
                                setData(
                                    'bank_account_id',
                                    e.target.value
                                )
                            }
                            className="
                                w-full rounded-xl
                                border border-gray-300
                            "
                        >
                            <option value="">
                                Pilih Rekening
                            </option>

                            {bankAccounts.map((bank) => (
                                <option
                                    key={bank.id}
                                    value={bank.id}
                                >
                                    {bank.bank_name} -
                                    {bank.account_number}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Nominal Withdraw"
                            value={data.amount}
                            onChange={(e) =>
                                setData(
                                    'amount',
                                    e.target.value
                                )
                            }
                            className="
                                w-full rounded-xl
                                border border-gray-300
                            "
                        />

                        <button
                            disabled={processing}
                            className="
                                px-5 py-2 rounded-xl
                                bg-mint-300 text-white
                            "
                        >
                            Withdraw
                        </button>
                    </form>
                </div>

                {/* RIWAYAT WITHDRAW */}
                <div className="
                    p-6 rounded-2xl
                    bg-white dark:bg-dark-card
                    border border-mint-200
                ">
                    <h2 className="font-semibold mb-4">
                        Riwayat Withdraw
                    </h2>

                    <div className="space-y-3">

                        {withdrawals.map((withdrawal) => (

                            <div
                                key={withdrawal.id}
                                className="
                                    flex justify-between
                                    border-b pb-3
                                "
                            >
                                <div>
                                    <p className="font-medium">
                                        Rp {
                                            Number(withdrawal.amount)
                                                .toLocaleString('id-ID')
                                        }
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {
                                            withdrawal.bank_account
                                                ?.bank_name
                                        }
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="
                                        text-sm capitalize
                                    ">
                                        {withdrawal.status}
                                    </p>

                                    <p className="
                                        text-xs text-gray-400
                                    ">
                                        {withdrawal.created_at}
                                    </p>
                                </div>
                            </div>

                        ))}

                    </div>
                </div>

                {/* RIWAYAT TRANSAKSI */}
                <div className="
                    p-6 rounded-2xl
                    bg-white dark:bg-dark-card
                    border border-mint-200
                ">
                    <h2 className="font-semibold mb-4">
                        Riwayat Transaksi
                    </h2>

                    <div className="space-y-3">

                        {wallet.transactions.map((trx) => (

                            <div
                                key={trx.id}
                                className="
                                    flex justify-between
                                    border-b pb-3
                                "
                            >
                                <div>
                                    <p className="font-medium">
                                        {trx.description}
                                    </p>

                                    <p className="
                                        text-xs text-gray-500
                                    ">
                                        {trx.type}
                                    </p>
                                </div>

                                <p>
                                    Rp {
                                        Number(trx.amount)
                                            .toLocaleString('id-ID')
                                    }
                                </p>
                            </div>

                        ))}

                    </div>
                </div>

            </div>

        </OwnerLayout>
    );
}